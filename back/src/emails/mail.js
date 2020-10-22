const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailToCustomer = async (user, order) => {
  const customer = `Poštovani/a, ${user.name}`;
  let message =
    customer + ', Vaša porudžbina je uspešna! \nNaručeni proizvodi: \n';
  order.products.map((product) => {
    message += '\t' + product.productName + ' x ' + product.count + '\n';
  });
  message += 'Cena: ' + order.price + ' RSD\n';
  message += 'Uskoro ćete biti kontaktirani, Vaše Medeno carstvo.';
  sgMail.send({
    to: user.email,
    from: process.env.EMAIL_SENDER,
    subject: 'Uspešna porudžbina!',
    text: message,
  });
};

const sendEmailToSeller = async (user, order) => {
  let message = 'Primljena je porudžbina! \nNaručeni proizvodi: \n';
  order.products.map((product) => {
    message += '\t' + product.productName + ' x ' + product.count + '\n';
  });
  message += 'Cena: ' + order.price + ' RSD\n';
  const userData = `Kontakt podaci: \n${user.name}, ${user.email}, ${user.phone}, ${user.address}`;
  message += userData;
  sgMail.send({
    to: process.env.EMAIL_SENDER,
    from: process.env.EMAIL_SENDER,
    subject: 'Primljena je porudžbina!',
    text: message,
  });
};

module.exports = { sendEmailToCustomer, sendEmailToSeller };
