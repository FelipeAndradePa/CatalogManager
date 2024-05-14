import React, { useState } from "react";

function Include() {

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = () => {
        
    }
     return (
        <div>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {selectedImage && (
                <div>
                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
            )}        
        </div>
    );
}

export default Include;