const express = require("express");
const app = express();
const { Ioelettrodomestici, Naturasi, MisterToys, Jysk, MiinCosmetics } = require("./models");
const path = require('path');
const { init } = require("./database.js");


let sequelize = init();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Получение средней цены по сайтам
app.get("/api/average-prices", async (req, res) => {
    try {
        const averagePrices = [
            { site: "Ioelettrodomestici", avgPrice: await Ioelettrodomestici.sum("Цена") / await Ioelettrodomestici.count() },
            { site: "Naturasi", avgPrice: await Naturasi.sum("Цена") / await Naturasi.count() },
            { site: "MisterToys", avgPrice: await MisterToys.sum("Цена") / await MisterToys.count() },
            { site: "Jysk", avgPrice: await Jysk.sum("Цена") / await Jysk.count() },
            { site: "MiinCosmetics", avgPrice: await MiinCosmetics.sum("Цена") / await MiinCosmetics.count() }
        ];
        res.json(averagePrices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Количество товаров по категориям
app.get("/api/category-counts", async (req, res) => {
    try {
        const categoryCounts = await Jysk.findAll({
            attributes: ["Серия", [sequelize.fn("COUNT", sequelize.col("Серия")), "count"]],
            group: ["Серия"]
        });
        res.json(categoryCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});
