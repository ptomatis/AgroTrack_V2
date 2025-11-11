const http = require('http');  // Este modulo nos permite crear el servidor HTTP de forma nativa.
const url = require('url');    // Este modulo nos permite parsear URLs, para sepaerar rutas, parametros, etc.
const { route } = require('./lib/router');   // Importamos la funcion route que maneja el enrutamiento de las solicitudes.

const PORT = 8888;    // Aca seteamos el puerto del servidor.


// Creamos el servidor HTTP, pasandole una funcion que maneja las solicitudes entrantes.
const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = url.parse(req.url, true);
    await route(req, res, pathname);    // Llamamos a la funcion route para manejar la solicitud.
  } catch (e) {
    // en caso de excepción no controlada
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Error 500</h1>');
  }
});

server.listen(PORT, () => {                     //Levanto el server en el puerto especificado
  console.log(`http://localhost:${PORT}`);
});
