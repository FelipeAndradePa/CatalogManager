import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './button.css';

const Button =  (props) => {
    return (
        <button className="bgcolorhover p-1 ps-2 hover:p-3 rounded-lg w-full flex flex-row justify-start items-center"> 
            <FontAwesomeIcon icon={props.icon} />
            <Link className="text-base ms-2 link" to={props.path}>{props.name}</Link>
        </button>
    );
}

export default Button;