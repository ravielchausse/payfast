var expressValidator = require('express-validator')
, logger = require('../servicos/logger.js')
, bodyParser = require('body-parser')
, consign = require('consign')
, express = require('express')
, morgan = require('morgan')
;

module.exports = function(){
	let app = express();

	app.use(morgan('common', {
		stream: {
			write: function (message) {
				logger.info(message);
			}
		}
	}));

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	app.use(expressValidator());

	consign()
	.include('controllers')
	.then('servicos')
	.into(app);

	return app;
}