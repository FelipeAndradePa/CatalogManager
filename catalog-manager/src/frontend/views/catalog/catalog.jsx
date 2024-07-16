import React, { useState, useEffect } from "react";
import axios from 'axios';
import Title from "../../components/title/title";
import { showModalDelete, showModalEdit } from "../../components/modal/modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../../node_modules/react-paginate/theme/basic/react-paginate.css';

const Catalog = ({ limit = false }) => {

    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentCatalog, setCurrentCatalog] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/catalog');
                const result = response.data;
                setCurrentCatalog(result);
            } catch (error) {
                console.error('Erro ao obter os dados do catálogo: ', error);
            }
        }
        fetchData();
    }, []);

    const handleCatalog = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);
    }

    const limitedCatalog = limit ? currentCatalog.slice(0, limit) : currentCatalog;
    console.log(currentCatalog);
    return (
        <div>
            {!limit &&
                <div className='font-sans'>
                    <Title title='Catálogo' icon='list'></Title>
                </div>
            }
            <div className="my-16">
                {!limit &&
                    <div className="flex flex-row justify-between">
                        <div>
                            <select value={selectedCategory} onChange={handleCatalog} className="mb-8 p-2 w-72 border rounded-md">
                                <option value="" disabled>Selecione uma opção</option>
                                <option value="Camiseta">Camiseta</option>
                                <option value="Calça">Calça</option>
                                <option value="Bermuda">Bermuda</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Procure por uma peça"
                            className="p-1 mb-8 rounded-full bg-transparent outline-none text-[#7a9ba6] border border-gray-500"
                        />
                    </div>
                }
                <table className={`${!limit ? 'table-auto w-full' : 'table-fixed w-full'}`}>
                    <thead>
                        <tr className="border-b-2">
                            <th className="text-center text-slate-500 font-medium">Peça</th>
                            <th className="text-center text-slate-500 font-medium">Referência</th>
                            <th className="text-center text-slate-500 font-medium">Descrição</th>
                            <th className="text-center text-slate-500 font-medium">Tamanhos</th>
                            <th className="text-center text-slate-500 font-medium">Valor</th>
                            <th className="text-center text-slate-500 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limitedCatalog.map((catalog) => (
                            <tr key={catalog.id}>
                                <td className="py-3 text-center">
                                    <div className="flex justify-center items-center">
                                        <img src={catalog.images[0].url} alt="Peça" className="h-36 w-36" />
                                    </div>
                                </td>
                                <td className="py-3 text-center align-middle">
                                    {catalog.reference_code}
                                </td>
                                <td className="py-3 text-center align-middle">
                                    {catalog.description}
                                </td>
                                <td className="py-3 text-center align-middle">
                                    {catalog.sizes}
                                </td>
                                <td className="py-3 text-center align-middle">
                                    {catalog.value}
                                </td>
                                <td className="py-3 text-center align-middle">
                                    <button onClick={() => showModalEdit(catalog.id)} className="text-blue-500"><FontAwesomeIcon icon='pen' /></button>
                                    <button onClick={() => showModalDelete(catalog.id)} className="ms-4 text-red-500"><FontAwesomeIcon icon='trash' /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Catalog;