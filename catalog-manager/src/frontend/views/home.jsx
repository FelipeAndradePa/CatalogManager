import React from "react";
import Title from "../components/title/title";
import Historic from "./historic/historic";
import Catalog from "./catalog/catalog";
import CatalogCalendar from "../components/calendar/catalogCalendar";

const Home = () => {

    const alterationDates = [
        new Date(2024, 4, 15), // 15 de maio de 2024
        new Date(2024, 4, 20), // 20 de maio de 2024
        new Date(2024, 5, 5),  // 5 de junho de 2024
    ];

    return (
        <div>
            <div>
                <Title title='Página Inicial' icon='house'></Title>
            </div>
            <div className="my-16">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col items-center card bg-white shadow p-4">
                        <div className="mb-4 pt-4 border-b-2">
                            <h2 className="text-slate-500 text-lg font-semibold">Calendário de Alterações</h2>
                        </div>
                        <CatalogCalendar alterationDates={alterationDates} />
                    </div>
                    <div className="flex flex-col items-center card shadow p-3">
                        <div className="pt-4 border-b-2">
                            <h2 className="text-slate-500 text-lg font-semibold">Histórico de Alterações</h2>
                        </div>
                        <Historic limit={4}></Historic>
                        <button className="bg-green-500 hover:bg-green-700 rounded-full py-2 w-40 text-white font-bold">Visualizar todas</button>
                    </div>
                </div>
                <div className="my-16 flex flex-col items-center card shadow p-3">
                        <div className="px-4 pt-4 border-b-2">
                            <h2 className="text-slate-500 text-lg font-semibold">Resumo do Catálogo Atual</h2>
                        </div>
                        <Catalog limit={4}></Catalog>
                        <button className="bg-green-500 hover:bg-green-700 rounded-full py-2 w-56 text-white font-bold">Ver catálogo completo</button>
                </div>
            </div>
        </div>
    );
}

export default Home;

