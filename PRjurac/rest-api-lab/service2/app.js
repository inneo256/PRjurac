const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

 let items = [];

const SERVICE1_URL = 'http://service1:3001/items'; 



// POST данные на первый сервис
app.get('/get-items', async (req, res) => {
    try {
        const response = await axios.get(SERVICE1_URL);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ 
            error: 'Cannot reach Service1', 
            details: err.message 
        });
    }
});

app.post('/add-item', async (req, res) => {
    try {
        const response = await axios.post(SERVICE1_URL, req.body);
        res.json(response.data);
    } catch (err) {
        // здесь мы возвращаем клиенту понятное сообщение об ошибке
        res.status(500).json({ 
            error: 'Cannot reach Service1', 
            details: err.message 
        });
    }
});

app.listen(3002, () => console.log('Service2 running on port 3002'));

let items2 = [];

app.post('/add-item', async (req, res) => {
  const item = req.body;
  items2.push(item);
  res.json({ message: 'Item added to Service2', item });
});

app.get('/get-items', (req, res) => {
  res.json(items2);
});