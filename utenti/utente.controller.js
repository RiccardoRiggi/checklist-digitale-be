const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./utente.service');

// routes
router.post('/autenticazione', authenticateSchema, authenticate);
router.post('/registra',authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/utenteCorrente', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, aggiorna);
router.delete('/:id', authorize(),deleteSchema ,eliminazioneLogica);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
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
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
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