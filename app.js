const express       = require('express');
const bodyParser    = require('body-parser');
const axios         = require('axios');
const ejs           = require('ejs');
const app           = express();
const PORT          = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', ejs);

app.get('/', (req, res) => {
	res.render('index.ejs', {rate: '', calculatedResult: '', disclaimer: ''});
});

app.post('/', (req, res) => {
	let url = 'https://api.coindesk.com/v1/bpi/currentprice/eur.json';
	let currency = req.body.currency;
	let amount = req.body.bitcoinAmount;

	axios.get(url)
	.then(function(responce) {
		let rate;
		let rateFloat;
		let code;
		let result;
		if(currency === 'EUR') {
			rate = responce.data.bpi.EUR.rate;
			rateFloat = responce.data.bpi.EUR.rate_float;
			code = responce.data.bpi.EUR.code;
		} else if (currency === 'USD') {
			rate = responce.data.bpi.USD.rate;
			rateFloat = responce.data.bpi.USD.rate_float;
			code = responce.data.bpi.USD.code;
		}
		let disclaimer = responce.data.disclaimer;
		if (amount > 0) {
			result = amount * rateFloat;
		} else {
			amount = 0;
			result = 0;
		}
		res.render('index.ejs', {rate: `Rate: ${rate} ${code}`, calculatedResult: `Price for ${amount} pcs: ${result} ${code}`, disclaimer: disclaimer});
	})
	.catch(function(error) {
		console.log(error);
	});
});

app.listen(PORT, () => {
	console.log(`Port ${PORT} is running`);
});