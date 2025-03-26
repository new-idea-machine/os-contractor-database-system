import React from 'react';
import { Navigation } from '../components';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ProfilePicture from '../components/ProfilePicture';

import './About.css';

const teamMembers = [];

// Placeholder biography -- remove when actual biographies are incorporated:

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing ' +
  'elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
  'ut aliquip ex ea commodo consequat.';

teamMembers.push({name:  'Ada Opene', role: 'Project Manager', profileImage:  null, biography: loremIpsum});
teamMembers.push({name:  'Nonso Afulukwe', role: 'Project Owner', profileImage:  null, biography: loremIpsum});
teamMembers.push({name:  'Diego Gomez', role: 'Developer', profileImage:  null, biography: loremIpsum});
teamMembers.push({name:  'Afshin Sharifnia', role: 'Quality Assurance', profileImage:  null, biography: loremIpsum});
teamMembers.push({name:  'Sanja Ivansic', role: 'Developer', profileImage:  null, biography: loremIpsum});
teamMembers.push({name:  'Irena Skachedub', role: 'Developer', profileImage:  null, biography: loremIpsum});

export default function About() {
  return (
    <>
      <Navigation />
      <main>
        <h1>Meet Our Team</h1>

        <p>
          This application is designed to help Recruiters to find a perfect fit
          for their company&apos;s next project and to help Contractors utilize
          their talent.
        </p>

        <ResponsiveGrid minColumnWidth="410px" rowGap="10px">
          {teamMembers.map((member, index) =>
            <div className='teamCard flexCenter' key={index}>
              <div className='biography'>{member.biography}</div>
              <ProfilePicture profileImage={member.profileImage} size='200px' />
              <h2>{member.name}</h2>
              <h3>{member.role}</h3>
            </div>
            )
          }
        </ResponsiveGrid>
      </main>
    </>
  );
}
