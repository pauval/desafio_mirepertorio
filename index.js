const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const path = './repertorio.json';

app.get('/canciones', (req, res) => {
    const data = fs.readFileSync(path, 'utf-8');
    res.json(JSON.parse(data));
});

app.post('/canciones', (req, res) => {
    const newSong = req.body;
    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    data.push(newSong);
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    res.status(201).send('Canción agregada');
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const updatedSong = req.body;
    let data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    data = data.map(song => song.id === parseInt(id) ? updatedSong : song);
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    res.send('Canción actualizada');
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al eliminar la canción');
            return;
        }
        let canciones = JSON.parse(data);

        const originalLength = canciones.length;
        canciones = canciones.filter(cancion => cancion.id !== parseInt(id));

        if (canciones.length === originalLength) {
            res.status(404).send('Canción no encontrada');
            return;
        }
        fs.writeFile(path, JSON.stringify(canciones, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al eliminar la canción');
                return;
            }
            res.send('Canción eliminada');
        });
    });
});
