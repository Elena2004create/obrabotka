// Визуализация средней цены по сайтам
fetch('/api/average-prices')
    .then(response => response.json())
    .then(data => {
        const sites = data.map(d => d.site);
        const avgPrices = data.map(d => d.avgPrice);

        const trace = {
            x: sites,
            y: avgPrices,
            type: 'bar'
        };

        const layout = {
            title: 'Средняя цена по сайтам',
            xaxis: { title: 'Сайты' },
            yaxis: { title: 'Средняя цена' }
        };

        Plotly.newPlot('average-prices', [trace], layout);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Визуализация количества товаров по категориям
fetch('/api/category-counts')
    .then(response => response.json())
    .then(data => {
        const categories = data.map(d => d.Серия);
        const counts = data.map(d => parseInt(d.count));

        const trace = {
            x: categories,
            y: counts,
            type: 'bar'
        };

        const layout = {
            title: 'Количество товаров по категориям'
        };

        Plotly.newPlot('category-counts', [trace], layout);
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));
