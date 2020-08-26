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


app.listen(process.env.PORT || 3000);

// backend

var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("TEST-5744316853073209-042221-b94a8e34a8b2eebcb55d450403627c82-228139103");

var payment_data = {
  transaction_amount: parseFloat(req.body.amount),
  token: req.body.token,
  description: req.body.title,
  installments: parseInt(req.body.installmentsOption),
  payment_method_id: req.body.paymentMethodId,
  payer: {
    email: req.body.email
  }
};

mercadopago.payment.save(payment_data).then(function (data) {
      console.log(data);
      res.send(data);
    }).catch(function (error) {
      console.log(error);
    });