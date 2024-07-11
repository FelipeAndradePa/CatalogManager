import React from "react";
import img from "../../../assets/logo.png";
import Button from "../button/button";

const Navbar = () => {
    return (
        <nav className="sticky top-0">
            <div className='mx-auto py-10'>
                <div className="flex flex-row justify-center">
                    <img src={img} alt="Codi logo" className='max-w-64'/>
                </div>
                <div className='space-y-5 py-8'>
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