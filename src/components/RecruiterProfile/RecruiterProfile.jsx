import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from '../../contexts/Authorization';
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedinIcon from "@mui/icons-material/LinkedIn";
import PlaceIcon from "@mui/icons-material/Place";
import { Country } from "country-state-city";
import ProfilePicture from "../ProfilePicture";

import { ReactComponent as IconChat } from "../../assets/icons/chat.svg";

import "./RecruiterProfile.css";

const RecruiterProfile = (props) => {
  const recruiter = props.data;
  const { user } = useContext(authContext);
  const userUid = user?.uid;
  const isOwnProfile = (recruiter?.firebaseUID === userUid);
  const allCountries = Country.getAllCountries();

  return (
    <div id="RecruiterProfile">
      <aside>
        <ProfilePicture profileImage={recruiter?.profileImg} size="150px" />

        {recruiter?.githubUrl && (
          <p>
            <a
              href={recruiter?.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon /> GitHub
            </a>
          </p>
        )}

        {recruiter?.linkedinUrl && (
          <p>
            <a
              href={recruiter?.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon /> LinkedIn
            </a>
          </p>
        )}

        {!isOwnProfile && (
          <Link to={`/chat/${recruiter?.firebaseUID}`}>
            <IconChat /> Chat
          </Link>
        )}
      </aside>

      <div>
        <header>
          <h1>{recruiter?.firstName}&nbsp;{recruiter?.lastName}</h1>
          <h3>{recruiter?.companyName}</h3>
          <h4>{recruiter?.qualification}</h4>

          <section>
            {recruiter?.countryCode ? allCountries.map((code) => {
                if (code.isoCode === recruiter?.countryCode)
                  return (
                    <div
                      key={code.isoCode}
                      style={{
                        display: "flex",
                        alignContent: "center",
                        paddingBottom: "10px",
                      }}
                    >
                      <PlaceIcon />
                      <div>{code.name},</div>
                      <div>&nbsp;{recruiter?.stateCode},</div>
                      <div>&nbsp;{recruiter?.city}</div>
                    </div>
                  );
              }) : 
              <>&nbsp;</>
            }

            <div>
              {recruiter?.workSite}
            </div>

            <div>
              {recruiter?.availability === 'Other' ? recruiter?.availabilityDetails : recruiter?.availability}
            </div>
          </section>
        </header>

        <section>
          <h2>About</h2>

          <p>
            {recruiter?.companyInfo}
          </p>
        </section>
      </div>
    </div>
  );
};

export default RecruiterProfile;
