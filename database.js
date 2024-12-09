const { Sequelize } = require("sequelize");



function init(){
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite'
    });

    return sequelize;
}

module.exports = {init};

