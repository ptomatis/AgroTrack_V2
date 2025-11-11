// lib/utils/response.js

function send(res, status, headers, body) {                
  res.writeHead(status, headers);
  res.end(body);
}

function html(res, status, body) {
  send(res, status, { 'Content-Type': 'text/html; charset=utf-8' }, body);
}

function okHtml(res, body) {
  html(res, 200, body);
}

function statusOnly(res, status) {
  send(res, status, { 'Content-Type': 'text/plain; charset=utf-8' }, '');
}

module.exports = { send, html, okHtml, statusOnly };
