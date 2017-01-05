module.exports = function (app) {
	
	app.post('/correios/calculo-prazo', (req, res) => {

		let dadosDaEntrega = req.body;
		let correiosSOAPClient = new app.servicos.correiosSOAPClient();

		correiosSOAPClient.calculaPrazo(dadosDaEntrega, (error, resultado) => {
			if (error) {
				console.log({error: error});
				res.status(500).send(error);
			}
			else {
				console.log({resultado: resultado});
				res.json(resultado);
			}
			return;
		});
	});

}