const mercadopago = require('mercadopago');
const config = require('../config');
mercadopago.configurations.setAccessToken(config.private_key);

module.exports = {
  sendPayment: async (req, res) => {
    try {
      const payment_data = {
        transaction_amount: Number(req.body.transactionAmount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.paymentMethodId,
        issuer_id: req.body.issuer,
        payer: {
          email: req.body.email,
          identification: {
            type: req.body.docType,
            number: req.body.docNumber
          }
        }
      };
      
      await mercadopago.payment.save(payment_data);
      return res.render('success');
    }
    catch (e) {
      console.log('error:', e);
      const mercadoPagoStatusError = e.status || 500;
      return res.status(mercadoPagoStatusError).send(e.message);
    }
  },
  sendPaymentBoleto: async (req, res) => {
    try {
      const get_payment_methods = await this.getPaymentMethods();

      const get_payment_boleto = get_payment_methods
        .find(item => item.payment_type_id === 'ticket');
      const payment_data = {
        transaction_amount: Number(req.body.transactionAmount),
        description: req.body.description,
        payment_method_id: get_payment_boleto.id,
        payer: {
          email: req.body.email,
          first_name: 'Test',
          last_name: 'User',
          identification: {
              type: req.body.docType,
              number: req.body.docNumber
          },
          address:  {
              zip_code: req.body.zip_code,
              street_name: req.body.street_name,
              street_number: req.body.street_number,
              neighborhood: req.body.neighborhood,
              city: req.body.city,
              federal_unit: req.body.federal_unit
          }
        }
      };

      await mercadopago.payment.create(payment_data);
      return res.render('success');
    }
    catch (e) {
      console.log('error:', e);
      const mercadoPagoStatusError = e.status || 500;
      return res.status(mercadoPagoStatusError).send(e.message);
    }
  },
  getPaymentMethods: async () => {
    const payment_methods = await mercadopago.get("/v1/payment_methods");
    return payment_methods;
  }
};
