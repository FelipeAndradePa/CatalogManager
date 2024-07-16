import React, { useState } from "react";
import img from "../../../assets/logo.png";
import Button from "../button/button";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0">
            <div className='mx-auto py-10'>
                <div className="flex flex-row justify-center">
                    <img src={img} alt="Codi logo" className='max-w-64' />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-500 focus:outline-none sm:hidden"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                            />
                        </svg>
                    </button>
                </div>
                <div className={`space-y-5 py-8 ${isOpen ? 'block' : 'hidden'} sm:block`}>
                    <Button path='' name='Página Inicial' icon='house'></Button>
                    <Button path='inclusao' name='Inclusão de Peças' icon='plus'></Button>
                    <Button path='catalogo' name='Visualização do catálogo' icon='list'></Button>
                    <Button path='historico' name='Histórico de Alterações' icon='repeat'></Button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;