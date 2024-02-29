import React, { useContext } from 'react';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';
import { Navigation } from '../components';
import ProfilePicture from '../components/ProfilePicture';
import Networking from ".//../assets/networking.jpg";

export default function About() {
  return (
    <>
      <Navigation />
      <main className='aboutPage'>
        <div className='imgContainer'>
          <h2 className='creators'> Meet our Team: </h2>

          <h2 className='motto' role='textbox' aria-multiline='true'>
          This application is designed to help Recruiters to find a perfect fit for their company&apos;s next project and to help Contractors utilize their talent.
          </h2>
        </div>

        <div className='teamContainer'>
          <div className='teamCard flexCenter'>
            <div className='biography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            <ProfilePicture profileImage={null} size="200px" />
            <h2 className='teamMember'>Ada Opene</h2>
            <h3 className='role'>Project Manager</h3>
          </div>

          <div className='teamCard flexCenter'>
            <div className='biography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            <ProfilePicture profileImage={null} size="200px" />
            <h2 className='teamMember'>Nonso Afulukwe</h2>
            <h3 className='role'>Product Owner</h3>
          </div>
          <div className='teamCard flexCenter'>
            <div className='biography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            <div className='imageWrapper'>
              <div className='biography'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </div>
              <ProfilePicture profileImage={null} size="200px" />
            </div>
            <h2 className='teamMember'>Diego Gomez</h2>
            <h3 className='role'>Developer</h3>
          </div>
          <div className='teamCard flexCenter'>
            <div className='biography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            <ProfilePicture profileImage={null} size="200px" />
            <h2 className='teamMember'>Afshin Sharifnia</h2>
            <h3 className='role'>Quality Assurance </h3>
          </div>
          <div className='teamCard flexCenter'>
            <div className='biography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            <div className='imageWrapper'>
              <div className='biography'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </div>
              <ProfilePicture profileImage={null} size="200px" />
            </div>
            <h2 className='teamMember'>Sanja Ivansic</h2>
            <h3 className='role'>Developer</h3>
          </div>
          <div className='teamCard flexCenter'>
            <div className='biography'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            <ProfilePicture profileImage={null} size="200px" />
            <h2 className='teamMember'>Irina Skachedub</h2>
            <h3 className='role'>Developer</h3>
          </div>
        </div>
      </main>
    </>
  );
}
