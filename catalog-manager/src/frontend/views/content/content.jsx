import React from "react";
import Navbar from "../../components/nav/navbar";
import { Outlet } from 'react-router-dom';
import './content.css';

const Content = () => {

    return (
        <div className="min-h-screen grid grid-cols-12 gap-2">
            <div className="bgcolor border-r col-span-2">
                <Navbar/>
            </div>
            <div className="px-28 py-16 col-span-10">
                <Outlet />
            </div>
        </div>
    );
}

export default Content;