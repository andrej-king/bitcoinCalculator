const express       = require('express');
const bodyParser    = require('body-parser');
const axios         = require('axios');
const app           = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
	let url = 'https://api.coindesk.com/v1/bpi/currentprice/eur.json';
	let currency = req.body.currency;
	axios.get(url)
	.then(function(responce) {
		let rate;
		let code;
		if(currency === 'EUR') {
			rate = responce.data.bpi.EUR.rate;
			code = responce.data.bpi.EUR.code;
		} else if (currency === 'USD') {
			rate = responce.data.bpi.USD.rate;
			code = responce.data.bpi.USD.code;
		}
		let disclaimer = responce.data.disclaimer;
		res.write(`<p>${rate} ${code}</p>`);
		res.write(`<p>${disclaimer}</p>`);
		res.send();
	})
	.catch(function(error) {
		console.log(error);
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});