// Middleware de logger para registrar peticiones HTTP

/**
 * Middleware de logger que registra todas las peticiones HTTP
 */
function logger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Registrar la petición entrante
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip || req.connection.remoteAddress}`);
  
  // Interceptar el evento 'finish' para registrar la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 500 ? '🔴' : 
                       res.statusCode >= 400 ? '🟡' : '🟢';
    
    console.log(
      `[${new Date().toISOString()}] ${statusColor} ${req.method} ${req.path} - ` +
      `Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });
  
  next();
}

module.exports = logger;

