﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// dichiaro i percorsi delle API
app.use('/utenti', require('./utenti/utente.controller'));
app.use('/veicoli', require('./veicoli/veicoli.controller'));
app.use('/checklistTemplate', require('./checklisttemplate/checklisttemplate.controller'));
app.use('/rigaChecklistTemplate', require('./rigachecklisttemplate/rigachecklisttemplate.controller'));

app.use('/checklist', require('./checklist/checklist.controller'));
app.use('/rigaChecklist', require('./rigachecklist/rigachecklist.controller'));

// imposto il gestore degli errori globale
app.use(errorHandler);

// avvio il server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server avviato sulla porta ' + port));