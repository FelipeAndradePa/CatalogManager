import Swal from 'sweetalert2';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import './modal.css';
import { generatePdf } from '../pdfGenerator/pdfGenerator';

const showModalInclusion = (includedPieces) => {

    withReactContent(Swal).fire({
        title: "Selecione a opção desejada",
        showConfirmButton: false,
        html: `
            <div class="modalContainerInclusion">
                <button id="createNew" class="modalButton inclusion">Criar novo</button>
                <button id="addToCurrent" class="modalButton inclusion">Adicionar ao atual</button>
            </div>
        `,
        didOpen: () => {
            document.getElementById('createNew').addEventListener('click', () => {
                generatePdf()
                axios.post('http://localhost:3001/api/create', { includedPieces})
                    .then(response => {
                        console.log('Novo catálogo criado:', response.data);
                        Swal.fire('Sucesso!', 'Novo catálogo criado.', 'success');
                    })
                    .catch(error => {
                        console.error('Erro ao criar novo:', error);
                        Swal.fire('Erro!', 'Não foi possível criar novo item.', 'error');
                    });
            });

            document.getElementById('addToCurrent').addEventListener('click', () => {
                axios.post('http://localhost:3001/add', {})
                    .then(response => {
                        console.log('Adicionado ao catálogo existente:', response.data);
                        Swal.fire('Sucesso!', 'Peças adicionadas ao catálogo.', 'success');
                    })
                    .catch(error => {
                        console.error('Erro ao criar novo:', error);
                        Swal.fire('Erro!', 'Não foi possível adicionar os itens.', 'error');
                    });
            });
        }
    });
};

const showModalDelete = (id) => {
    withReactContent(Swal).fire({
        title: "Excluir item",
        text: "Confirme se deseja excluir o item do catálogo",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Excluir item",
        cancelButtonText: "Cancelar"
    }).then(() => {
        axios.delete(`http://localhost:3001/api/delete/${id}`)
                    .then(response => {
                        console.log('Peça excluída do catálogo:', response.data);
                        Swal.fire('Sucesso!', 'Peça excluída do catálogo.', 'success');
                    })
                    .catch(error => {
                        console.error('Erro ao excluir peça:', error);
                        Swal.fire('Erro!', 'Não foi possível excluir a peça.', 'error');
                    });
    });
};

const showModalEdit = (id) => {
    withReactContent(Swal).fire({
        title: "Selecione a informação que deseja editar",
        width: '41em',
        showConfirmButton: false,
        html: `
            <div class="modalContainer">
                <button id="image" class="modalButton">Imagem</button>
                <button id="infos" class="modalButton">Outras informações</button>
            </div>
        `,
        didOpen: () => {
            document.getElementById('image').addEventListener('click', () => chooseImage(id));
            document.getElementById('infos').addEventListener('click', () => changeInfos(id));
        },
        willClose: () => {
            document.getElementById('image').addEventListener('click', () => chooseImage(id));
            document.getElementById('infos').addEventListener('click', () => changeInfos(id));
        }
    });
};

const chooseImage = async (id) => {

    try {
        const response = await axios.get(`http://localhost:3001/api/images/${id}`); // passa o id referente à peça que a imagem pertence
        const images = response.data;

        const imageOptions = images.map(image =>  
            `<img src="${image.url}" alt="Image" class="selectableImage" data-id="${image.id}" style="width: 100px; margin: 5px; cursor: pointer;" />`
        ).join(''); // image.id é o id específico da imagem que será alterada

        withReactContent(Swal).fire({
            title: "Selecione a imagem",
            width: '41em',
            showConfirmButton: false,
            html: `
                <div class="modalContainer">
                    ${imageOptions}
                </div>
            `,
            didOpen: () => {
                document.querySelectorAll('.selectableImage').forEach(img => {
                    img.addEventListener('click', (e) => {
                        const selectedImageId = e.target.getAttribute('data-id');
                        changeImage(selectedImageId);
                    });
                });
            }    
        });
    } catch (error) {

    }
}
const changeImage = (imageId) => {
    withReactContent(Swal).fire({
        title: 'Selecione a nova imagem',
        input: 'file',
        inputAttributes: {
            "accept": "image/*",
            "aria-label": "Upload your profile picture"
        },
        preConfirm: async (file) => {
            
            const reader = new FileReader();
            const formData = new FormData();

            reader.readAsDataURL(file);
            const newImage = {file, dataUrl: file.name}
            formData.append('images', newImage.file);
            
            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const imageUrl = response.data.urls;
            const prefixedImageUrl = 'http://localhost:3001' + imageUrl;
            
            return prefixedImageUrl;
        }
    }).then((prefixedImageUrl) => {
        const value = prefixedImageUrl.value;
        axios.patch(`http://localhost:3001/api/editImage/${imageId}`, {value})
                    .then(response => {
                        console.log('Imagem alterada no catálogo:', response.data);
                        Swal.fire('Sucesso!', 'Peça excluída do catálogo.', 'success');
                    })
                    .catch(error => {
                        console.error('Erro ao excluir peça:', error);
                        Swal.fire('Erro!', 'Não foi possível excluir a peça.', 'error');
                    });
    });
};

const changeInfos = (id) => {
    withReactContent(Swal).fire({
        title: 'Preencha os campos que deseja alterar',
        html: `<div id="main-container">
                    <div class="inputs-container">
                        <label for="description">Descrição:</label>
                        <input type="text" name="description" id="description">
                    </div>
                    <div class="inputs-container">
                        <label for="reference">Referência:</label>
                        <input type="text" name="reference" id="reference">
                    </div>
                    <div class="inputs-container">
                        <label for="value">Valor:</label>
                        <input type="text" name="value" id="value">
                    </div>
                    <div id="checkbox-container">
                        <input type="checkbox" name="size38" value="38">
                        <label for="size38">38</label><br>
                        <input type="checkbox" name="size40" value="40">
                        <label for="size40">40</label><br>
                        <input type="checkbox" name="size42" value="42">
                        <label for="size42">42</label><br>
                        <input type="checkbox" name="size44" value="44">
                        <label for="size44">44</label><br>
                        <input type="checkbox" name="size46" value="46">
                        <label for="size46">46</label><br>
                        <input type="checkbox" name="size48" value="48">
                        <label for="size48">48</label><br>
                    </div>
               </div>
            `,
            showCancelButton: true,
            preConfirm: () => {
                const inputDescription = document.getElementById("description").value;
                const inputReference = document.getElementById("reference").value;
                const inputValue = document.getElementById("value").value;
                //Cria um array para armazenar todas os checkbox marcados
                const selectedSizes = Array.from(document.querySelectorAll('#checkbox-container input:checked')).map(cb => cb.value);
                /*if (selectedSizes.length === 0) {
                    Swal.showValidationMessage('Você precisa selecionar ao menos um tamanho!');
                }*/
                const data = {description: inputDescription, reference: inputReference, value: inputValue, sizes: selectedSizes}
                return data;
            }
        
    }).then((data) => {
        console.log(data);
        axios.patch(`http://localhost:3001/api/edit/${id}`, { data })
                    .then(response => {
                        console.log('Código referência alterado:', response.data);
                        Swal.fire('Sucesso!', 'Código referência alterado.', 'success');
                    })
                    .catch(error => {
                        console.error('Erro ao alterar o código referência:', error); // Add logger
                        Swal.fire('Erro!', 'Não foi possível alterar o código referência.', 'error');
                    });
    });
};


const modalHistory = (pieceId, id) => {
    withReactContent(Swal).fire({
        title:"Tem certeza que deseja desfazer a alteração?",
        showCancelButton: true,  
    }).then(() => {
        axios.put(`http://localhost:3001/api/retry/${id}`, { pieceId })
                .then(response => {
                    Swal.fire('Sucesso!', 'Alteração desfeita.', 'success');
                })
                .catch(error => {
                    Swal.fire('Erro!', 'Não foi possível desfazer a alteração.', 'error');
                });
    });
}

export {showModalDelete, showModalEdit, showModalInclusion, changeImage, changeInfos, modalHistory};
