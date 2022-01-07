const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./utente.service');
const logAutenticazioneService = require('../logAutenticazioni/logAutenticazioni.service');
const logOperazioniService = require('../logOperazioni/logOperazioni.service');

/*
    ROUTES
*/
router.post('/autenticazione', autenticazioneValidation, autenticazione);
router.get('/utenteCorrente', authorize(), getUtenteCorrenteLoggato);
router.get('/', authorize(), getListaUtenti);
router.post('/registra', authorize(), registrazioneValidation, registraUtente);
router.get('/:id', authorize(), getUtenteById);
router.put('/:id', authorize(), aggiornamentoValidation, aggiornaUtente);
router.delete('/:id', authorize(), deleteValidation, eliminazioneLogica);

module.exports = router;

//    Funzione per validare gli input del path /autenticazione
function autenticazioneValidation(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//    Funzione per effettuare l'autenticazione
function autenticazione(req, res, next) {
    userService.autenticaUtente(req.body)
        .then(user => res.json(user))
        .catch(next);
    const log = {
        email: req.body.email
    }
    logAutenticazioneService.create(log);
    logOperazioniService.registraLogOperazione(req.originalUrl,req.body.email, JSON.stringify(req.body));
}

//    Funzione per recuperare i dati dell'utente loggato
function getUtenteCorrenteLoggato(req, res, next) {
    res.json(req.user);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare la lista degli utenti
function getListaUtenti(req, res, next) {
    userService.getListaUtenti()
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per la creazione di un nuovo utente
function registrazioneValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        cognome: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
        tRuoloCodice: Joi.string().max(1).required(),
        userInsert: Joi.string().required(),
        dataDiNascita: Joi.date().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per registrare un nuovo utente
function registraUtente(req, res, next) {
    userService.inserisciUtente(req.body)
        .then(() => res.json({ message: 'Utente registrato con successo' }))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare un singolo utente
function getUtenteById(req, res, next) {
    userService.getUtente(req.params.id)
        .then(user => res.json(user))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per aggiornare un utente
function aggiornamentoValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        cognome: Joi.string().empty(''),
        userUpdate: Joi.string().required(),
        dataDiNascita: Joi.date(),
        email: Joi.string().email(),
        tRuoloCodice: Joi.string().max(1),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per aggiorare un utente
function aggiornaUtente(req, res, next) {
    userService.aggiornaUtente(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

//  Funzione per validare la cancellazione di un utente
function deleteValidation(req, res, next) {
    const schema = Joi.object({
        identificativo: Joi.number().equal(req.params.id),
        userDelete: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per eliminare logicamente un utente
function eliminazioneLogica(req, res, next) {
    userService.cancellaUtenteLogicamente(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}














































