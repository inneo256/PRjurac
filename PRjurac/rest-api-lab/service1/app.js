const express = require('express');
const app = express();
app.use(express.json());

let items = [];

// GET
app.get('/items', (req, res) => res.json(items));

// POST
app.post('/items', (req, res) => {
    const item = req.body;
    items.push(item);
    res.json({ message: 'Item added', item });
});

// PUT
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    items[id] = req.body;
    res.json({ message: 'Item updated', item: items[id] });
});

// DELETE
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const removed = items.splice(id, 1);
    res.json({ message: 'Item deleted', item: removed[0] });
});

app.listen(3001, () => console.log('Service1 running on port 3001'));

const axios = require('axios');

// Новый маршрут для проверки связи с Service2
app.get('/from-service2', async (req, res) => {
  try {
    const response = await axios.get('http://service2:3002/get-items'); 
    res.json({ fromService2: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Cannot reach Service2', details: err.message });
  }
});