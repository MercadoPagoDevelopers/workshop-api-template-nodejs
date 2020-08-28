var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
const { sendPayment } = require('./lib/mercadopago');
var app = express();

app.use(express.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
    res.render('home');
});
app.post('/detail', function (req, res) {
    res.render('detail', req.body);
});

app.post('/process_payment', (req, res) => sendPayment(req, res));

app.listen(process.env.PORT || 3000);