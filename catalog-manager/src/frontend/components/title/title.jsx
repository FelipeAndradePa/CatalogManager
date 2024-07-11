import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Title = (props) => {
    return (
        <div>
            <div className='flex items-center border-b-2 border-amber-800'>
                <FontAwesomeIcon icon={props.icon} className='size-6 text-black' />
                <h1 className='ms-3 flex-auto text-3xl font-semibold text-black'>{props.title}</h1>
            </div>
        </div>
    );
}

export default Title;