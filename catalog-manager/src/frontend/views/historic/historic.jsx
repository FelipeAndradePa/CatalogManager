import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Title from "../../components/title/title";
import { modalHistory } from "../../components/modal/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Historic = ({limit = false}) => {

    const [history, setHistory] = useState([]);
    
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/history');
                const result = response.data;
                const finalResult = result.map((rst) => {
                    const dateObject = new Date(rst.changed_at);
                    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
                    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}`;

                    const arrAlterations = rst.alterations.split(",");
                    // retorna para result o rst com as novas propriedades
                    return {
                        ...rst,
                        date: dateObject.toISOString().split('T')[0],
                        time: formattedTime,
                        arrAlterations
                    };
                })
                setHistory(finalResult);
            } catch (error) {
                console.error('Erro ao obter dados do histórico: ', error);
            }
        }
        fetchData();
    }, []);

    const length = history.length;
    const limitedHistory = limit ? history.slice(length - limit, length) : history;

    return (
        <div>
            {!limit && 
                <div className='font-sans'>
                    <Title title='Histórico de Alterações' icon='repeat'></Title>
                </div>
            }
            <div className={`${!limit ? 'py-16' : 'py-8'}`}>
                <table className={`${!limit ? 'table-auto w-full' : 'table-fixed'}`}>
                    <thead>
                        <tr className="border-b-2">
                            <th className="text-center text-slate-500 font-medium">Data</th>
                            <th className="text-center text-slate-500 font-medium">Hora</th>
                            <th className="text-center text-slate-500 font-medium">Alteração</th>
                            {!limit && <th className="text-center text-slate-500 font-medium">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {limitedHistory.map((hst) => (
                            <tr key={hst.id}>
                                <td className="py-3 text-center">
                                    {hst.date}
                                </td>
                                <td className="py-3 text-center">
                                    {hst.time}
                                </td>
                                <td className="py-3 text-center">
                                    <ol>
                                        {hst.arrAlterations.map((arr) => (
                                            <li>
                                                {arr}
                                            </li>                                        
                                        ))}
                                    </ol>
                                </td>
                                {!limit && 
                                    <td className="py-3 text-center">
                                        <button onClick={() => modalHistory(hst.pieceId, hst.id)} className="text-green-500"><FontAwesomeIcon icon='repeat' /></button>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Historic;