const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Catalog = require('./catalog');

const Image = sequelize.define('Image', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Catalog,
            key: 'id'
        }
    }
}, {
    tableName: 'catalog_images', // Nome da tabela existente
    timestamps: false, // Se as colunas createdAt e updatedAt existem
})

Catalog.hasMany(Image, { foreignKey: 'catalogId' });
Image.belongsTo(Catalog, { foreignKey: 'catalogId' });

module.exports = Image;