const http = require('http');
const { usuarios, clubes } = require('./data');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    // Agregar cabeceras CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const url = req.url.split('/');
    
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        if (req.method === 'GET' && url[1] === 'usuarios') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(usuarios));
        } else if (req.method === 'POST' && url[1] === 'usuarios') {
            const newUser = JSON.parse(body);
            newUser.id = usuarios.length + 1;
            usuarios.push(newUser);
            res.statusCode = 201;
            res.end(JSON.stringify(newUser));
        } else if (req.method === 'DELETE' && url[1] === 'usuarios' && url[2]) {
            const id = parseInt(url[2]);
            const index = usuarios.findIndex(u => u.id === id);
            if (index > -1) {
                usuarios.splice(index, 1);
                res.statusCode = 204;
                res.end();
            } else {
                res.statusCode = 404;
                res.end('Usuario no encontrado');
            }
        } else if (req.method === 'PUT' && url[1] === 'usuarios' && url[2]) {
            const id = parseInt(url[2]);
            const index = usuarios.findIndex(u => u.id === id);
            if (index > -1) {
                const updatedUser = JSON.parse(body);
                usuarios[index] = { ...usuarios[index], ...updatedUser };
                res.statusCode = 200;
                res.end(JSON.stringify(usuarios[index]));
            } else {
                res.statusCode = 404;
                res.end('Usuario no encontrado');
            }
        } else if (req.method === 'GET' && url[1] === 'clubes') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(clubes));
        } else {
            res.statusCode = 404;
            res.end('Ruta no encontrada');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}/`);
});