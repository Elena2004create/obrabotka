const schedule = require('node-schedule');
const path = require('path');
const request = require('request');
const { JSDOM } = require('jsdom');
const { init} = require("./database");
const fetch = require('node-fetch');
const {Ioelettrodomestici, Naturasi , MisterToys, Jysk, MiinCosmetics,  set_task, ready_task, error_task} = require("./models");

/*
async function fetchIntoTable(sq, url, selectors, names, table) {
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            res = getData(body, selectors, names);
            (async () => {
                insertIntoDatabase(sq, res, table);
            })();

        }
    });
}

function getData(value, selectors, names) {
    const doc = new JSDOM(value);
    const res = [];

    selectors.forEach((selector, index) => {
        const elements = doc.window.document.querySelectorAll(selector);
        elements.forEach((element, i) => {
            if (!res[i]) {
                res[i] = {};
            }
            res[i][names[index]] = element.textContent.trim();
        });
    });
    return res;
}

// отделить создание базы данных и логику
let sq, ioelettrodomestici = init();
fetchIntoTable(sq, 'https://ioelettrodomestici.it/141-frigorifero-incasso', 
    ['.product-name', '.product-price', '.regular-price', '.product-description-short', '.product-availability'], 
    ['Название', 'Цена', 'Предыдущая цена', 'Описание', 'Доступность товара'],
    ioelettrodomestici)
*/

function insertIntoDatabase(sequelize, table, data) {
    for (const element of data) {
        try {
            table.create(element);
        } catch (error) {
            console.error('Ошибка при вставке данных:', error);
        }
    }
}

function getData(html, selectors, names) {
    const doc = new JSDOM(html);
    const res = [];

    selectors.forEach((selector, index) => {
        const elements = doc.window.document.querySelectorAll(selector);
        elements.forEach((element, i) => {
            if (!res[i]) {
                res[i] = {};
            }
            res[i][names[index]] = element.textContent.trim();
        });
    });

    return res;
}

/* async function fetchIntoTable(table, url, selectors, names, task) {
    const sequelize  = init();
    //let sequelize, Table = init();
    //     request(url, async (error, response, body) => {
    //         if (!error && response.statusCode === 200) {
    //             const data = getData(body, selectors, names);
    //             await insertIntoDatabase(sequelize, table, data);
    //         } else {
    //             console.error('Ошибка при запросе данных:', error);
    //         }
    //     }).then(()=>{ready_task(task)}).catch(()=>{error_task(task)});
    // }
    try {
        const response = await fetch(url);

        if (response.ok) {
            const body = await response.text(); // Если данные в текстовом формате
            const data = getData(body, selectors, names); // Аналог вашей функции обработки данных

            await insertIntoDatabase(sequelize, table, data); // Вставка в базу данных
            await ready_task(task); // Обработка успешного задания
        } else {
            console.error('Ошибка HTTP:', response.status, response.statusText);
            await error_task(task); // Обработка ошибки задания
        }
    } catch (error) {
        console.error('Ошибка при запросе данных:', error);
        await error_task(task); // Обработка ошибки задания
    }
} */


async function fetchIntoTable(table, url, selectors, names, task) {
    const sequelize = init();

    request(url, async (error, response, body) => {
        if (error) {
            console.error('Ошибка при запросе данных:', error);
            await error_task(task); 
            return;
        }

        if (response.statusCode === 200) {
            try {
                const data = getData(body, selectors, names); 
                insertIntoDatabase(sequelize, table, data); 
                await ready_task(task); 
            } catch (err) {
                console.error('Ошибка при обработке данных:', err);
                await error_task(task); 
            }
        } else {
            console.error('Ошибка HTTP:', response.statusCode, response.statusMessage);
            await error_task(task);
        }
    });
}

async function FetchAll() {
    task = await set_task(Ioelettrodomestici.name)
    fetchIntoTable(Ioelettrodomestici, 
        'https://ioelettrodomestici.it/141-frigorifero-incasso', 
        ['.product-name', '.product-price', '.regular-price', '.product-description-short', '.product-availability'], 
        ['Название', 'Цена', 'Предыдущая цена', 'Описание', 'Доступность товара'], task
    )

    task = await set_task(Naturasi.name)
    await fetchIntoTable(
        Naturasi,
        'https://www.naturasi.it/prodotti/dispensa-e-condimenti',
        ['.brand', '.name', '.price', '.package-detail', '.netweight-price'],
        ['Бренд', 'Название', 'Цена', 'Упаковка', 'Цена за нетто'], task
    )

    task = await set_task(MisterToys.name)

    await fetchIntoTable(
        MisterToys,
        'https://www.mistertoysmegastore.com/pattini-skateboard-monopattini?page=3',
        ['div[class="product_name"]', '.ax-product-cats', '.price', '.regular-price'],
        ['Название', 'Категория', 'Цена', 'Предыдущая цена'], task
    )

    task = await set_task(Jysk.name)
    await fetchIntoTable(
        Jysk,
        'https://jysk.it/giardino/lettini-e-sdraio',
        ['.product-teaser-title__series', '.product-teaser-title__name', '.product-price-value', '.price-before'],
        ['Серия', 'Название', 'Цена', 'Предыдущая цена'], task
    )

    task = await set_task(MiinCosmetics.name)

    await fetchIntoTable(
        MiinCosmetics,
        'https://miin-cosmetics.it/skincare/routine-coreana/686-doppia-detersione',
        ['.product-manufacturer', 'h3[class="product-title"]', '.product-subtitle', '.price', '.radio-label'],
        ['Бренд', 'Название', 'Описание', 'Цена', 'Объем'], task
    )
};

schedule.scheduleJob('* * * * *', FetchAll);

setInterval(()=>{}, 1000)