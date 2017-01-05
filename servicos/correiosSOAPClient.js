var soap = require('soap');

function CorreiosSOAPClient() {
	this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPClient.prototype.calculaPrazo = function (dadosDaEntrega, callback){
	
	soap.createClient(this._url, function (error, cliente) {

		let attributes = {
			nCdServico: dadosDaEntrega.codServico,
			sCepOrigim: dadosDaEntrega.cepOrigim,
			sCepDestino: dadosDaEntrega.cepDestino
		};

		console.log({attributes: attributes, dadosDaEntrega: dadosDaEntrega});
		cliente.CalcPrazo(attributes, callback);
	});

	return;
}

module.exports = function () {
	return CorreiosSOAPClient;
}