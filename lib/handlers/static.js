const path = require('path');
const fs = require('fs');
const mime = require('../utils/mime');
const { serveFile, serve404 } = require('../utils/file');

function handleStatic(req, res, pathname) {
  // Ruta raíz -> index.html
  if (pathname === '/') {
    serveFile(path.join(__dirname, '../../public/index.html'), res);                // Sirve index.html para la raíz
    return true;
  }

  // Intenta servir cualquier archivo dentro de /public
  const safe = path.normalize(pathname).replace(/^(\.\.[/\\])+/,'');
  const filePath = path.join(__dirname, '../../public', safe);
  const ext = path.extname(filePath);
  if (!mime[ext]) return false; // no es archivo estático conocido

  fs.readFile(filePath, (err, content) => {               // Lee el archivo solicitado
    if (err) return serve404(res);
    const type = mime[ext];
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
  return true;
}

module.exports = { handleStatic };     // exporta la funcion handleStatic
