require('dotenv').config();
const fs = require('fs');

module.exports = {
    "development": {
        "url": process.env.DATABASE_URL,
        define: {
            freezeTableName: true
        },
        "seederStorage": "sequelize",
        "dialect": "postgres"
    },
    "production": {
        "url": process.env.DATABASE_URL,
        define: {
            freezeTableName: true
        },
        "seederStorage": "sequelize",
        "dialect": "postgres"
    }
}