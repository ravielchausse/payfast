var logger = require('../servicos/logger.js')
, Daos = require('../Daos')
;

module.exports = (app) => {

	app.get('/pagamentos', (req, res) => {
		console.log('Recebida requisicao de teste na porta 3000.')
		res.send('OK.');
	});

	app.get('/pagamentos/pagamento/:id', (req, res) => {

		let id = req.params.id;
		logger.info('Consultando pagamento: ' + id);

		/************************************************************************************
		* Memcached
		*/
		let memcachedClient = new app.servicos.memcachedClient();

		memcachedClient.get('pagamento-' + id, (error, retorno) => {
			if (error || !retorno) {
				console.log('MISS - Key not found.');
				let dao = new Daos();
				dao.pagamentoDao.buscaPorId(id, (error, resultado) => {
					if (error) {
						console.log({error_buscaPorId: error});
						res.status(500).send(erro);
					}
					else {
						console.log({buscaPorId: resultado});

						memcachedClient.set('pagamento-' + id, resultado, 60000, (error) => {
							if (error) {
								console.log({create: false});
							}
							else {
								console.log({create: true});
							}
						});
						
						res.json(resultado);
					}
					return;
				});
				return;
			}
			else {
				console.log('HIT - value: ' + JSON.stringify(retorno));		
				res.json(retorno);
			}
			return;
		});

		/************************************************************************************/
	});

	app.delete('/pagamentos/pagamento/:id', (req, res) => {

		let pagamento = {};

		let id = req.params.id;
		pagamento.id = id;
		pagamento.status = 'CANCELADO';

		let dao = new Daos();

		dao.pagamentoDao.atualiza(pagamento, (erro) => {

			if (erro) {
				res.status(500).send(erro);
			}
			else {
				console.log({status: 'CANCELADO'});
				res.status(204).send(pagamento);
			}
			return;
		});

		return;
	});

	app.put('/pagamentos/pagamento/:id', (req, res) => {

		let pagamento = {};

		let id = req.params.id;
		pagamento.id = id;
		pagamento.status = 'CONFIRMADO';

		let dao = new Daos();

		dao.pagamentoDao.atualiza(pagamento, (erro) => {

			if (erro) {
				res.status(500).send(erro);
			}
			else {
				console.log({status: 'CONFIRMADO'});
				res.send(pagamento);
			}
			return;
		});

		return;
	});

	app.post('/pagamentos/pagamento', (req, res) => {

		/**
		* Forma de Pagamento
		*/
		req.assert("pagamento.forma_de_pagamento", "Forma de pagamento eh obrigatorio").notEmpty();

		/**
		* Valor
		*/
		req.assert("pagamento.valor", "Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();

		let erros = req.validationErrors();

		if (erros){
			console.log('Erros de validacao encontrados');
			res.status(400).send(erros);
			return;
		}

		let pagamento = req.body['pagamento'];
		console.log('processando uma requisicao de um novo pagamento');

		pagamento.status = 'CRIADO';
		pagamento.data = new Date;

		let dao = new Daos();

		dao.pagamentoDao.salva(pagamento, (erro, resultado) => {

			if(erro){
				console.log('Erro ao inserir no banco:' + erro);
				res.status(500).send(erro);
			} 
			else {

				pagamento.id = resultado.insertId;
				console.log('pagamento criado');

				/************************************************************************************
				* Memcached
				*/
				let memcachedClient = new app.servicos.memcachedClient();

				memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60000, (error) => {
					if (error) {
						console.log({create: false});
					}
					else {
						console.log({create: true});
					}
				});

				/************************************************************************************/

				if (pagamento.forma_de_pagamento == 'cartao') {

					let clienteCartoes = new app.servicos.clienteCartoes();
					let cartao = req.body['cartao'];

					clienteCartoes.autoriza(cartao, (error, request, response, attributes) => {
						if (error) {
							console.log({error: error});
							res.status(400).send(error);
						}
						else {
							res.location(`/pagamentos/pagamento/${pagamento.id}`);
							let response = {
								dados_do_pagamento: pagamento,
								dados_do_cartao: attributes.dados_do_cartao,
								links: [
								{
									href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
									rel: 'CONFIRMAR',
									method: 'PUT'
								},
								{
									href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
									rel: 'CANCELAR',
									method: 'DELETE'
								}
								]
							};
							res.status(201).json(response);
						}
						return;
					});
				}
				else {

					res.location(`/pagamentos/pagamento/${pagamento.id}`);
					let response = {
						dados_do_pagamento: pagamento,
						links: [
						{
							href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
							rel: 'CONFIRMAR',
							method: 'PUT'
						},
						{
							href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
							rel: 'CANCELAR',
							method: 'DELETE'
						}
						]
					};
					res.status(201).json(response);
				}
				return;
			}
		});

	});
}
