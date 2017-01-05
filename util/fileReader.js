var fs = require('fs');

fs.readFile('imagem.jpg', (error, buffer) => {
	console.log({readFile: 'ok'});
	fs.writeFile('imagem2.jpg', buffer, (err) => {
		console.log({writeFile: 'ok'});
	});
});