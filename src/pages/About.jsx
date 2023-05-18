import React, { useContext } from 'react';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';
import { Footer, Navigation } from '../components';
import Handshake from ".//../assets/handshake.jpg";

export default function About() {


    return(
        <>
        <Navigation />
        <div className='aboutPage'>

        <h2
					style={{
						textAlign: 'left',
						color: 'white',
						width: '60%',
                        marginTop: '100px',
					}}
				>
					Helping contractors to utilize (showcase)  their talents  
				</h2>

                

        </div>
        
        
        
        
        
        
        
        
        
        
        <Footer />
        </>



    );


}