const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const History = sequelize.define('History',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pieceId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    },
    alterations: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    tableName: 'history', // Nome da tabela existente
    timestamps: true, // Se as colunas createdAt e updatedAt existem
    createdAt: 'changed_at',
});

module.exports = History;