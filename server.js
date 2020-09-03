var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

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

app.post('/process_payment', function (req, res) {
    var mercadopago = require('mercadopago');
    mercadopago.configurations.setAccessToken("TEST-249219817450644-111300-1ac6fc62fb47adf917a9b3da9bb907c8-141751821");

    var payment_data = {
    transaction_amount: Number(req.body.transactionAmount),
    token: req.body.token,
    description: req.body.description,
    installments: Number(req.body.installments),
    payment_method_id: req.body.paymentMethodId,
    payer: {
        email: req.body.email,
        identification: {
        type: req.body.docType,
        number: req.body.docNumber
        }
    }
    };

    mercadopago.payment.save(payment_data)
    .then(function(response) {
        res.status(response.status).json({
        status: response.body.status,
        status_detail: response.body.status_detail,
        id: response.body.id
        });
    })
    .catch(function(error) {
        res.status(response.status).send(error);
    });
});

app.post('/process_payment_ticket', function (req, res) {
    var mercadopago = require('mercadopago');
    mercadopago.configurations.setAccessToken("TEST-249219817450644-111300-1ac6fc62fb47adf917a9b3da9bb907c8-141751821");

    var payment_data = {
    transaction_amount: 100,
    description: 'Título do produto',
    payment_method_id: 'bolbradesco',
    payer: {
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
        identification: {
            type: 'CPF',
            number: '19119119100'
        },
        address:  {
            zip_code: '06233200',
            street_name: 'Av. das Nações Unidas',
            street_number: '3003',
            neighborhood: 'Bonfim',
            city: 'Osasco',
            federal_unit: 'SP'
        }
    }
    };

    mercadopago.payment.create(payment_data).then(function (data) {
        res.send(data);
    }).catch(function (error) {

    });
})

app.listen(process.env.PORT || 3000);