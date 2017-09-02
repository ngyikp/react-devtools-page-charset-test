'use strict';

const express = require('express');
const app = express();

const links = [
    '/good',
    '/bad',
];

const template = `
<meta charset="{charset}">

<div id="app"></div>

<script crossorigin src="https://unpkg.com/react@15/dist/react.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@15/dist/react-dom.min.js"></script>
<script>
function app() {
	return React.createElement('div', {}, 'Hello world! Time is ' + Date.now());
}

ReactDOM.render(app(), document.getElementById('app'));
</script>

<ul>
	${links.map((link) => {return `<li><a href="${link}">${link}</a></li>`;}).join('')}
</ul>
`;

app.get('/', (req, res) => {
	res.redirect('/good');
})

app.get('/good', (req, res) => {
	const html = template.replace(/{charset}/, 'utf-8');
	res.send(html);
});

app.get('/bad', (req, res) => {
	const html = template.replace(/{charset}/, 'ISO-8859-1');

	// Manually set a Content-Type and use a Buffer to override forced UTF-8 setting by Express
	// https://github.com/expressjs/express/issues/2238
	// https://github.com/expressjs/express/blob/a4bd4373b2c3b2521ee4c499cb8e90e98f78bfa5/lib/response.js#L163-L172
	res.set({'content-type': 'text/html; charset=ISO-8859-1'});
	res.send(new Buffer(html));
});

app.listen(3000, () => {
	console.log('Example app listening on port 3000');
});