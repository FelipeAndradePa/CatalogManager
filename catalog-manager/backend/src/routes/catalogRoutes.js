const express = require('express');
const sequelize = require('../models')
const multer = require('multer');
const router = express.Router();
const path = require('path');
const Catalog = require('../models/catalog');
const Image = require('../models/image');
const History = require('../models/history');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const createCatalogsAndImages = async (includedPieces, transaction) => {
    const catalogPromises = includedPieces.map(async (piece) => {
        
        const type = piece.catalogType;
        const reference_code = piece.reference;
        const description = piece.description;
        const value = piece.value;
        const sizes = piece.sizes; 
        const images = piece.imagesToSave;
        // Cria um catálogo para cada peça
        const catalog = await Catalog.create({ type, reference_code, description, value, sizes: sizes.join(',') }, { transaction });

        // Prepara os registros de imagem para cada catálogo
        const imageRecords = images.map((url) => ({
            url,
            catalogId: catalog.id
        }));
        
        // Insere as imagens no banco de dados
        await Image.bulkCreate(imageRecords, { transaction });

        return catalog;
    });

    const catalogs = await Promise.all(catalogPromises);
    return catalogs;
};

const insertHistory = async (oldCatalog, alterations, transaction) => {
    const pieceId = oldCatalog.id;
    const type = oldCatalog.type;
    const reference_code = oldCatalog.reference_code;
    const description = oldCatalog.description;
    const value = oldCatalog.value;
    const sizes = oldCatalog.sizes;

    await History.create({ pieceId, type, reference_code, description, value, sizes, alterations: alterations.join(',') }, {transaction})
    await transaction.commit();
};

const createAlterations = (reference, description, value, sizes) => {
    const alterations = [];
    sizes = sizes.length === 0 ? false : true;
    
    if (reference) alterations.push(`Alteração no código referência: ${reference}`);
    if (description) alterations.push(`Alteração na descrição: ${description}`);
    if (value)  alterations.push(`Alteração no valor: ${value}`);
    if (sizes) alterations.push(`Alteração na grade de tamanhos: ${sizes}`);

    console.info(alterations);
    return alterations;
};

// middleware do multer
router.post('/upload', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
    }
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
});

router.get('/images/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const images = await Image.findAll({ where: {catalogId: id}})
        res.status(200).json(images);
    } catch (error) {

    }
});

router.get('/catalog', async (req, res) => {

    try {
        const catalogs = await Catalog.findAll({
            include: [{
                model: Image,
                limit: 1 // limita para retornar apenas uma imagem por registro
            }]
        });

        const catalogsWithOneImage = catalogs.map(catalog => {
            const catalogData = catalog.get({ plain: true });
            catalogData.images = catalogData.Images.slice(0,1);
            delete catalogData.Images;
            return catalogData;
        });

        res.status(200).json(catalogsWithOneImage);
    } catch (error) {

    }
});

router.post('/create', async (req, res) => {

    const { includedPieces } = req.body;
    const t = await sequelize.transaction();

    try {

        const catalogs = await createCatalogsAndImages(includedPieces, t);
        await t.commit();
        res.status(201).json(catalogs);
    } catch (error) {

    }
});

router.post('/add', (req, res) => {

})

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
        // Deletar as imagens associadas
        await Image.destroy({
            where: { catalogId: id },
            transaction: t
        });

        // Deletar o catálogo
        const deleted = await Catalog.destroy({
            where: { id: id },
            transaction: t
        });

        if (deleted) {
            await t.commit();
            res.status(200).json({ message: 'Peça excluída com sucesso!' });
        } else {
            await t.rollback();
            res.status(404).json({ error: 'Catalogo não encontrado' });
        }
    } catch (error) {
        await t.rollback();
        console.error('Erro em deletar a peça desejada:', error);
        res.status(500).json({ error: 'O sistema falhou em deletar a peça desejada' });
    }
});

// Lógica diferente devido a necessidade de identificar quais parâmetros serão atualizados
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { reference, description, sizes, value } = req.body.data.value;
    
    const t = await sequelize.transaction();
    
    try {
        const catalog = await Catalog.findByPk(id);
        const oldCatalog = catalog;

        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }

        // Atualiza os campos se eles forem fornecidos
        catalog.reference_code = reference ? reference : catalog.reference_code;
        catalog.description = description ? description : catalog.description;
        catalog.value = value ? value : catalog.value;
        catalog.sizes = sizes.length === 0 ? catalog.sizes : sizes.join(',');
        
        const alterations = createAlterations(reference, description, value, sizes);
        await catalog.save(); // Salva as mudanças no banco de dados
        await insertHistory(oldCatalog, alterations, t);
        res.status(200).json(catalog); // Retorna o catálogo atualizado

    } catch (error) {

    }
});

router.patch('/editImage/:id', async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        const image = await Image.findByPk(id);

        image.url = value;

        await image.save();

        res.status(200).json(image);

    } catch (error) {

    }
});

router.get('/history', async (req, res) => {
    try {
        const history = await History.findAll();
        res.status(200).json(history);
    } catch (error) {
        
    }
})

router.put('/retry/:id', async (req, res) => {
    const { id } = req.params;
    const { pieceId } = req.body;

    try {
        const historyCell = await History.findByPk(id);

        const [updated] = await Catalog.update(
            {
                reference_code: historyCell.reference_code,
                description: historyCell.description,
                value: historyCell.value,
                sizes: historyCell.sizes
            },
            {
                where: {id: pieceId}
            }
        )

        if (updated) {
            const updatedCatalog = await Catalog.findByPk(pieceId);
            return res.status(200).json(updatedCatalog);
        }
    } catch (error) {

    }
})

module.exports = router;

