const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Catalog = sequelize.define('Catalog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reference_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sizes: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'catalog', // Nome da tabela existente
    timestamps: true, // Se as colunas createdAt e updatedAt existem
    createdAt: 'created_at',
})

module.exports = Catalog;