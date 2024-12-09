
const { DataTypes } = require("sequelize");
const { init } = require("./database.js");


let sequelize = init();

async function set_task(name){
    return await FetchTasks.create({"Статус": "В процессе", "Имя": name})

}

async function error_task(task){
    task.Статус = "Ошибка"
    await task.save()
    
}async function ready_task(task){
    task.Статус = "Готово"
    await task.save()
    
}


const Ioelettrodomestici = sequelize.define('ioelettrodomestici', {
    "Название": DataTypes.STRING,
    "Цена": DataTypes.INTEGER,
    "Предыдущая цена": DataTypes.INTEGER,
    "Описание": DataTypes.STRING,
    "Доступность товара": DataTypes.STRING,
});

const Naturasi = sequelize.define('naturasi', {
    "Бренд": DataTypes.STRING,
    "Название": DataTypes.STRING,
    "Цена": DataTypes.STRING,
    "Упаковка": DataTypes.STRING,
    "Цена за нетто": DataTypes.STRING,
});

const MisterToys = sequelize.define('mister_toys', {
    "Название": DataTypes.STRING,
    "Категория": DataTypes.STRING,
    "Цена": DataTypes.STRING,
    "Предыдущая цена": DataTypes.STRING,
});

const Jysk = sequelize.define('jysk', {
    "Серия": DataTypes.STRING,
    "Название": DataTypes.STRING,
    "Цена": DataTypes.STRING,
    "Предыдущая цена": DataTypes.STRING,
});

const MiinCosmetics = sequelize.define('miin_cosmetics', {
    "Бренд": DataTypes.STRING,
    "Название": DataTypes.STRING,
    "Описание": DataTypes.STRING,
    "Цена": DataTypes.STRING,
    "Объем": DataTypes.STRING,
});

const FetchTasks = sequelize.define('fetch_tasks', {
    "Имя": DataTypes.STRING,
    "Статус": DataTypes.STRING,
});

sequelize.authenticate()
        .then(() => {
            console.log('Соединение с базой данных успешно установлено.');
        })
        .catch((error) => {
            console.error('Ошибка при подключении к базе данных:', error);
        });

sequelize.sync()

module.exports = {Ioelettrodomestici, Naturasi , MisterToys, Jysk, MiinCosmetics, set_task, ready_task, error_task};