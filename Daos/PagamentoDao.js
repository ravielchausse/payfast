module.exports = class PagamentoDao {

	constructor(connection) {
		this._connection = connection;
	}

	atualiza(pagamento, callback) {
		this._connection.query('UPDATE pagamentos SET status = ? where id = ?', [pagamento.status, pagamento.id], callback);
	}

	salva(pagamento, callback) {
		this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
	}

	lista(callback) {
		this._connection.query('select * from pagamentos', callback);
	}

	buscaPorId(id, callback) {
		this._connection.query("select * from pagamentos where id = ?", [id], callback);
	}
}