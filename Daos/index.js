var mysql  = require('mysql')
, PagamentoDao = require('./PagamentoDao')
;

module.exports = class Daos {

	constructor() {
		this._connection = this.connectionFactory();
		this._pagamentoDao = new PagamentoDao(this.connection);
	}

	connectionFactory() {
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'root',
			database: 'payfast'
		});
	}

	get connection(){
		return this._connection;
	}

	get pagamentoDao() {
		return this._pagamentoDao;
	}

}