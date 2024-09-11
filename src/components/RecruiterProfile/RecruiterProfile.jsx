import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from '../../contexts/Authorization';
import LinkedinIcon from "@mui/icons-material/LinkedIn";
import ProfilePicture from "../ProfilePicture";

import { ReactComponent as IconChats } from "../../assets/icons/chats.svg";

import "./RecruiterProfile.css";

const RecruiterProfile = (props) => {
  const recruiter = props.data;
  const { user } = useContext(authContext);
  const userUid = user?.uid;
  const isOwnProfile = (recruiter?.firebaseUID === userUid);

  return (
    <div id="RecruiterProfile">
      <aside>
        <ProfilePicture profileImage={recruiter?.profileImg} size="150px" />

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
            <IconChats /> Chat
          </Link>
        )}
      </aside>

      <div>
        <header>
          <h1>{recruiter?.firstName}&nbsp;{recruiter?.lastName}</h1>
          <h3>{recruiter?.companyName}</h3>
          <h4>{recruiter?.qualification}</h4>

          <section>
            <div>
              {recruiter?.phone}
            </div>

            <div>
              {recruiter?.email}
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
