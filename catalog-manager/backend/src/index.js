require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./models');
const catalogRoutes = require('./routes/catalogRoutes');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/api', catalogRoutes);
app.use('/uploads', express.static('uploads'));

(async () => {
    try {
        // Autenticar a conexão com o banco de dados
        await sequelize.authenticate();
        // Sincronizar os modelos sem recriar as tabelas
        await sequelize.sync({ alter: true }); // Usar alter em vez de force
        console.log('Base de dados e tabelas sincronizadas!');

        // Iniciar o servidor após a sincronização
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = app;

