import React, { useState, useRef } from "react";
import Title from "../../components/title/title";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showModalInclusion } from "../../components/modal/modal";
import axios from 'axios';

const Inclusion = () => {

    const [options, setOptions] = useState(['38', '40', '42', '44', '46', '48']);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCatalog, setSelectedCatalog] = useState('');
    const [formGeneralData, setFormGeneralData] = useState({  // state do formulário
        reference: '',
        description: '',
        value: ''
    });
    const [includedPieces, setIncludedPieces] = useState([]); // state das peças incluídas
    const [imageUrls, setImageUrls] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files); // converte o objeto FileList em um array 
        const newImages = files.map((file) => {
            const reader = new FileReader(); // leitor de arquivo
            reader.readAsDataURL(file); //le as urls 
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve({ file, dataUrl: reader.result });
                };
            });
        });
        // espera o retorno de todas as promises para set as imagens
        Promise.all(newImages).then((images) => {
            setSelectedImages((prevImages) => [...prevImages, ...images]);
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files); // dataTransfer é usado em evento Drop
        const newImages = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve({ file, dataUrl: reader.result });
                };
            });
        });
        Promise.all(newImages).then((images) => {
            setSelectedImages((prevImages) => [...prevImages, ...images]);
        });
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleCatalogChange = (event) => {
        const value = event.target.value;
        setSelectedCatalog(value);
    }

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);

        if (value === 'Camiseta') {
            setOptions(['P', 'M', 'G']);
        } else {
            setOptions(['38', '40', '42', '44', '46', '48']);
        }

        setSelectedOptions([]);
    };

    const handleCheckboxChange = (event) => {
        const value = event.target.value;

        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(value)
                ? prevSelectedOptions.filter((option) => option !== value)
                : [...prevSelectedOptions, value]
        );
    };
    //função para manipular o estado de cada input
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormGeneralData({
            ...formGeneralData,
            [name]: value
        });
    };

    const handleInclusion = async (event) => {
        event.preventDefault();
        
        // criação do formData para imagem
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image.file);
        });
        console.log(formData);
        try {
            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const imageUrl = response.data.urls;
            setImageUrls(response.data.urls);
            const prefixedImageUrl = imageUrl.map(url => 'http://localhost:3001' + url);
            console.log(prefixedImageUrl);
            const dataToSend = {
                ...formGeneralData,
                imageView: prefixedImageUrl[0], // imagem para visualização
                imagesToSave: prefixedImageUrl, // todas as urls para serem salvas no banco
                category: selectedCategory, // os dados selecionados antes podem ser passados aqui
                catalogType: selectedCatalog,
                sizes: selectedOptions // os dados selecionados antes podem ser passados aqui
            };

            setIncludedPieces([...includedPieces, dataToSend]);
            console.log(includedPieces);
    
        } catch (error) {
            console.error("Erro ao fazer upload das imagens:", error);
        }
        setSelectedCatalog('');
        setSelectedCategory('');
        setOptions(['38', '40', '42', '44', '46', '48']);
        setSelectedOptions([]);
        setFormGeneralData({
            reference: '',
            description: '',
            value: ''
        });
        setSelectedImages([]);
    };

    return (
        <div>
            <div className='font-sans'>
                <Title title='Inclusão de peças' icon='plus'></Title>
            </div>
            <div className="flex flex-row justify-around">
                <div className="border-solid border-2 rounded-md mt-16 p-10">
                    <form onSubmit={handleInclusion}>
                        <div className='flex flex-col gap-10 justify-between'>
                            <div>
                                <label htmlFor="catalog"  className="block text-sm font-medium text-gray-600">
                                    Escolha o catálogo
                                </label>
                                <select value={selectedCatalog} onChange={handleCatalogChange} className="mt-2 p-2 w-96 border rounded-md">
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Catálogo de Camisetas">Catálogo de Camisetas</option>
                                    <option value="Catálogo de Bermudas">Catálogo de Bermudas</option>
                                    <option value="Catálogo modelos essenciais">Catálogo Modelos Essenciais</option>
                                    <option value="Catálogo modelos street">Catálogo Modelos Street</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-600">
                                    Tipo de peça
                                </label>
                                <select value={selectedCategory} onChange={handleSelectChange} className="mt-2 p-2 w-96 border rounded-md">
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Camiseta">Camiseta</option>
                                    <option value="Calça">Calça</option>
                                    <option value="Bermuda">Bermuda</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-gray-600"> Escolha os tamanhos: </label>
                                <div className="flex flex-row justify-between">
                                    {options.map((option, index) => (
                                        <label key={index} style={{ display: 'block' }}>
                                            <input
                                                type="checkbox"
                                                name="size"
                                                value={option}
                                                checked={selectedOptions.includes(option)}
                                                onChange={handleCheckboxChange}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="reference" className="block text-sm font-medium text-gray-600">
                                    Referência:
                                </label>
                                <input
                                    type="text"
                                    name="reference"
                                    value={formGeneralData.reference}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-96 border rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                                    Descrição da peça:
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formGeneralData.description}
                                    onChange={handleInputChange}
                                    className="mt-2 p-2 w-96 border rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="value" className="block text-sm font-medium text-gray-600">
                                    Valor:
                                </label>
                                <input
                                    type="text"
                                    name="value"
                                    value={formGeneralData.value}
                                    onChange={handleInputChange}
                                    inputmode="numeric"
                                    className="mt-2 p-2 w-96 border rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="Foto" className="block text-sm font-medium text-gray-600">Fotos</label>
                                <input
                                    name="Foto"
                                    type="file"
                                    onChange={handleImageChange}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                />
                                <div
                                    onDoubleClick={() => fileInputRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="w-96 h-72 border-2 border-dashed border-gray-400 flex justify-center items-center overflow-auto"
                                    style={{ height: '300px' }}
                                >
                                    {selectedImages.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedImages.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.dataUrl}
                                                    alt={`Selected ${index}`}
                                                    className="max-w-full max-h-full object-contain"
                                                    style={{ width: '180px', height: '180px' }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                            Arraste e solte uma imagem aqui, ou clique para selecionar uma.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-40">
                                    Incluir peça
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="w-2/5 h-auto flex flex-col items-center border-solid border-2 rounded-md mt-16">
                    <div className="px-4 pt-4 border-b-2">
                        <h2 className="text-slate-500 text-lg">Visualização das peças inseridas</h2>
                    </div>
                    {includedPieces.map((piece, index) => (
                        <div key={index} className="p-10 flex flex-row items-center">
                            <div>
                                <img src={piece.imageView} alt="Peça" className="h-28 w-28" />
                            </div>
                            <div className="px-7 align-middle">
                                <ul className="">
                                    <li>{piece.reference}</li>
                                    <li>{piece.description}</li>
                                    <li>{piece.sizes}</li>
                                    <li>R$ {piece.value}</li>
                                </ul>
                            </div>
                            <div>
                                <button className="ms-4 text-red-500"><FontAwesomeIcon icon='trash' /></button>
                            </div>
                        </div>     
                    ))}
                    <div>
                        <button onClick={() => showModalInclusion(includedPieces)} className="bg-green-500 hover:bg-green-700 rounded-full my-12 py-2 w-40 text-white font-bold">Finalizar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inclusion;