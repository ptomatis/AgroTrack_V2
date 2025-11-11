const { serve404 } = require('../utils/file');
function handleNotFound(res) { serve404(res); }
module.exports = { handleNotFound };
