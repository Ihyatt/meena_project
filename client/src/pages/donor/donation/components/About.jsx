import React, { act, useEffect, useState } from 'react';
import {DefaultDescription} from 'src/utils/constants';
import {AboutMeena} from 'src/utils/constants';

const About =({description}) => {
    const [toggleText, setToggleText] = useState('about');

    const handleClick = (type) => {
        setToggleText(type);
    }
    return (
        <div >
            <div className='flex justify-start pb-6'>
            <div onClick={() => handleClick('about')} className={
                `
                         font-medium
                    
                         py-3
                         cursor-pointer
                         mr-2
                         w-fit
                         ${toggleText =='about' ?
                  'text-black border-b-2 border-black transition-colors duration-300'
                  : 'text-[#0fa347]'}
                       `
              }
            >  
            ABOUT MEENA
                        
            
            </div>
            <div onClick={() => handleClick('campaign')}
            
            className ={
                `
                         font-medium
                         w-fit
                        py-3
                        ml-2
                         cursor-pointer
                         ${toggleText =='campaign' ?
                  'text-black border-b-2 border-black  transition-colors duration-300'
                  : 'text-[#0fa347]'}
                       `
              }
            
            >  
                 CAMPAIGN       
            
            </div>


            </div>
            {toggleText =='about' ? (AboutMeena) :(description || DefaultDescription)}
        </div>
    );
}
export default About;