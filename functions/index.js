/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API_KEY);
admin.initializeApp();

exports.sendAvailabilityChangeNotification = functions.firestore
    .document("techs/{availability}")
    .onUpdate(async (change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();
      console.log("email logic ", newValue)
      // Check if 'availability' has changed
      if (newValue.availability !== previousValue.availability) {
        const techId = context.params.id;

        // Fetch the list of recruiters who have favorited this tech user
        const favoritesQuery = admin.firestore()
            .collection("favs").where("techId", "==", techId);
        const favoritesQuerySnapshot = await favoritesQuery.get();

        const notificationPromises = [];

        favoritesQuerySnapshot.forEach(async(doc) => {
          const recruiterId = doc.data().recruiterId;
          const recruiterRef = admin.firestore()
              .collection("recruiter").doc(recruiterId);
          try {
            const recruiterDoc = await recruiterRef.get();
            if (recruiterDoc.exists) {
              const recruiterData = recruiterDoc.data();
              const recruiterEmail = recruiterData.email;

              // Send an email notification to the recruiter
              const msg = {
                to: recruiterEmail,
                from: "oscontractordb@gmail.com",
                subject: "Availability Change Notification",
                // text: `The availability of ${newValue.firstName}
              // ${newValue.lastName} has changed to ${newValue.availability}.`,
                templateId: "d-b5eb364b3f54480b80268c93ca8ade72",
                substitutionWrappers: ['{{', '}}'],
                substitutions: {
                    name: recruiterData.firstName
                }
              };

              notificationPromises.push(
                  sgMail.send(msg).catch((error) => {
                    console.error("Error sending email notification:", error);
                  }),
              );
            }
          } catch (error) {
            console.error("Error fetching recruiter data:", error);
          }
        });

        return Promise.all(notificationPromises);
      }

      return null; // No availability change, do nothing
    });
