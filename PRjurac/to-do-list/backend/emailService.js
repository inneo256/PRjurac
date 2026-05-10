//(IMAP для чтения писем)
const imaps = require('imap-simple');

const config = {
    imap: {
        user: process.env.EMAIL,
        password: process.env.EMAIL_PASS,
        host: 'imap.mail.ru',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

async function fetchEmails() {
  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');
  const messages = await connection.search(
    ['ALL'],
    { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true }
  );
  connection.end();
  return messages.map(m => m.parts[0].body);
}

module.exports = { fetchEmails };