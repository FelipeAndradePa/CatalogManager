import React, { useState, useRef } from "react";

function IncludeImage() {

    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files); // cria um array com as imagens
        const newImages = files.map((file) => { 
            const reader = new FileReader(); // leitor de arquivo
            reader.readAsDataURL(file); //le as urls 
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

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
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

     return (
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
                className="w-96"
                style={{height: '300px', border: '2px dashed #ccc' }}
            >
                {selectedImages.length > 0 ? (
                    selectedImages.map((image, index) => (
                        <img key={index} src={image} alt={`Selected ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', margin: '5px' }} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                        Arraste e solte uma imagem aqui, ou clique para selecionar uma.
                    </div>
                )}
            </div>       
        </div>
    );
}

export default IncludeImage;