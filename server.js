require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/utenti', require('./utenti/utente.controller'));
app.use('/veicoli', require('./veicoli/veicoli.controller'));
app.use('/checklistTemplate', require('./checklisttemplate/checklisttemplate.controller'));
app.use('/rigaChecklistTemplate', require('./rigachecklisttemplate/rigachecklisttemplate.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));