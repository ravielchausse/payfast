var fs = require('fs');

module.exports = (app) => {

	app.post('/upload/imagem', (req, res) => {
		console.log({upload: 'recebendo imagem'});

		let filename = req.headers.filename;

		req.pipe(fs.createWriteStream('files/' + filename))
		.on('finish', (error) => {
			console.log('finish');
			res.status(201).send('ok');
		});
	});

}