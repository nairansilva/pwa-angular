const express = require("express");
const bodyParser = require('body-parser');
const webpush = require('web-push');
const cors = require('cors');

const { enviarNotificacao } = require('./enviar-notificacao');
const { listarSeguros, salvarSeguro } = require('./seguro-service');
const { adicionaPushSubscriber } = require('./adiciona-push-subscriber');

const vapidKeys = {
  publicKey: 'BJrxCIUjbf2w7rCALXkIfgfnytrRbGIsXwCEp0GRm9QMRmGV1x_OACvQW2YCeD1FIxbAhcY1XY_4bYbIAZLwwGc',
  privateKey: 'yPq1JPXRnTOu_FYwlyXPx7kdpTXUpOxXdvzjMhsbhFY'
};

webpush.setVapidDetails(
  'mailto:nairan.silva@totvs.com.br',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.route('/api/seguros')
    .post(salvarSeguro);

app.route('/api/seguros')
    .get(listarSeguros);

app.route('/api/notificacao')
    .post(adicionaPushSubscriber);

app.route('/api/notificacao/enviar')
    .post(enviarNotificacao);

const PORT = 9090;
const HOST = 'localhost';

const httpServer = app.listen(PORT, HOST, () => {
    console.log("HTTP Server running at http://" + HOST + ":" + PORT);
});
