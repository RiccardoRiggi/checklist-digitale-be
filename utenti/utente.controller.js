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
router.post('/registra', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/utenteCorrente', authorize(), getUtenteCorrenteLoggato);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, aggiorna);
router.delete('/:id', authorize(), deleteSchema, eliminazioneLogica);

module.exports = router;

function registraLogOperazione(req, res, next) {
    logOperazioniService.registraLogOperazione(req.user.sub,req.body).then()
    .catch(next);
}

function autenticazioneValidation(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function autenticazione(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
        const log = {
            email:req.body.email
        }
        logAutenticazioneService.create(log);
        logOperazioniService.registraLogOperazione(req.body.email,JSON.stringify(req.body));

}



function registerSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        cognome: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
        idRuolo: Joi.number().min(0).max(10).required(),
        dataCreazione: Joi.date().required(),
        utenteCreazione: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
        logOperazioniService.registraLogOperazione(req.user.identificativo,JSON.stringify(req.body));    
}



function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getUtenteCorrenteLoggato(req, res, next) {
    res.json(req.user);
    logOperazioniService.registraLogOperazione(req.user.identificativo,JSON.stringify(req.body)); 
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        cognome: Joi.string().empty(''),
        dataAggiornamento: Joi.date().required(),
        utenteAggiornamento: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function deleteSchema(req, res, next) {
    const schema = Joi.object({
        dataEliminazione: Joi.date().required(),
        utenteEliminazione: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function aggiorna(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function eliminazioneLogica(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}