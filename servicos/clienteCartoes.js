var restify = require('restify');

function CartoesClient() {
	this._cliente = restify.createJsonClient({
		url: 'http://localhost:3001'
	});
}

var cartao = {
	"numero":1234123412341234,
	"bandeira":"visa",
	"ano_de_expiracao":2016,
	"mes_de_expiracao":12,
	"cvv":123
};

CartoesClient.prototype.autoriza = function (cartao, callback){
	this._cliente.post('/cartoes/autoriza', cartao, callback);
}

module.exports = () => {
	return CartoesClient;
}