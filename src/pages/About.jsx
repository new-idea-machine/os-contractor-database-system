import React, { useContext } from 'react';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';
import { Footer, Navigation } from '../components';
import Networking from ".//../assets/networking.jpg";
import Avatar from ".//../assets/avatar.png";

export default function About() {


    return(
        <>
        <Navigation />
        <div className='aboutPage'>
            <div className='imgContainer'>
            <img className='calgaryImage' src={Networking}></img>

        <h2 className='motto' contentEditable role='textbox' aria-multiline='true'
					
				>
					This application is designed to help Recruiters to find a perfect fit for their company’s next project and to help Contractors utilize their talent.   
				</h2>
                </div>

        <h2 className='creators'> Meet our Team: </h2>

            <div className='teamContainer'>
                <div className='teamCard flexCenter'>
                    <div className='biography'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </div>
                    <div className='imageWrapper'>
                    <img src={Avatar} alt="Avatar" />
                    </div>
                    <h2 className='teamMember'>Ada Opene</h2>
                    <h3 className='role'>Project Manager</h3>
                </div>

                <div className='teamCard flexCenter'>
                    <div className='imageWrapper'>
                    <img src={Avatar} alt="Avatar" />
                    </div>
                    <h2 className='teamMember'>Nonso Afulukwe</h2>
                    <h3 className='role'>Product Owner</h3>
                </div>
                <div className='teamCard flexCenter'>
                    <div className='imageWrapper'>
                    <img src={Avatar} alt="Avatar" />
                    </div>
                    <h2 className='teamMember'>Diego Gomez</h2>
                    <h3 className='role'>Developer</h3>
                </div>
                <div className='teamCard flexCenter'>
                    <div className='imageWrapper'>
                    <img src={Avatar} alt="Avatar" />
                    </div>
                    <h2 className='teamMember'>Afshin Sharifnia</h2>
                    <h3 className='role'>Quality Assurance </h3>
                </div>
                <div className='teamCard flexCenter'>
                    <div className='imageWrapper'>
                    <img src={Avatar} alt="Avatar" />
                    </div>
                    <h2 className='teamMember'>Sanja Ivansic</h2>
                    <h3 className='role'>Developer</h3>
                </div>
                <div className='teamCard flexCenter'>
                    <div className='imageWrapper'>
                    <img src={Avatar} alt="Avatar" />
                    </div>
                    <h2 className='teamMember'>Irina Skachedub</h2>
                    <h3 className='role'>Developer</h3>
                </div>
               
            </div>    

        </div>
        
        
        
        
        
        
        
        
        
        
        <Footer />
        </>



    );


}