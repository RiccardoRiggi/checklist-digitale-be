const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const veicoliService = require('./veicoli.service');
const logOperazioniService = require('../logOperazioni/logOperazioni.service');

router.get('/', authorize(), getListaVeicoli);
router.post('/inserisci', authorize(), registrazioneValidation, inserisciVeicolo);
router.get('/:id', authorize(), getVeicoloById);
router.put('/:id', authorize(), aggiornamentoValidation, aggiornaVeicolo);
router.delete('/:id', authorize(), deleteValidation, eliminaLogicamenteVeicolo);

module.exports = router;

//  Funzione per recuperare la lista dei veicoli
function getListaVeicoli(req, res, next) {
    veicoliService.getListaVeicoli()
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per l'inserimento di un veicolo
function registrazioneValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        selettiva: Joi.string().required(),
        tVeicoloCodice: Joi.string().required(),
        userInsert: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per registrare un nuovo veicolo
function inserisciVeicolo(req, res, next) {
    veicoliService.inserisciVeicolo(req.body)
        .then(() => res.json({ message: 'Veicolo inserito con successo' }))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare un singolo veicolo
function getVeicoloById(req, res, next) {
    veicoliService.getVeicolo(req.params.id)
        .then(user => res.json(user))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per aggiornare un veicolo
function aggiornamentoValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        selettiva: Joi.string().required(),
        tVeicoloCodice: Joi.string().required(),
        userUpdate: Joi.string().required(),
        tRuoloCodice: Joi.string().max(1),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per aggiorare un veicolo
function aggiornaVeicolo(req, res, next) {
    veicoliService.aggiornaVeicolo(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

//  Funzione per validare la cancellazione di un veicolo
function deleteValidation(req, res, next) {
    const schema = Joi.object({
        identificativo: Joi.number().equal(req.params.id),
        userDelete: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per eliminare logicamente un veicolo
function eliminaLogicamenteVeicolo(req, res, next) {
    veicoliService.cancellaLogicamenteVeicolo(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}














































