const fs = require('fs');
const path = require('path');
const mime = require('./mime');
const { html } = require('./response');

function serveFile(filePath, res, statusCode = 200) {                  // Sirve archivos estaticos
  fs.readFile(filePath, (err, content) => {
    if (err) return serve500(res);
    const ext = path.extname(filePath);
    const type = mime[ext] || 'application/octet-stream';
    res.writeHead(statusCode, { 'Content-Type': type });
    res.end(content);
  });
}

function serve404(res) {              // Sirve la pagina 404  
  fs.readFile(path.join(__dirname, '../../public/404.html'), (err, content) => {
    if (err) return html(res, 404, '<h1>404</h1><a href="/">Volver</a>');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
}

function serve500(res) {                // Sirve la pagina 500
  fs.readFile(path.join(__dirname, '../../public/500.html'), (err, content) => {
    if (err) return html(res, 500, '<h1>Error 500</h1>');
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
}

module.exports = { serveFile, serve404, serve500 };
