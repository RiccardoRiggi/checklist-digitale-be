const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const checkListTemplateService = require('./checklisttemplate.service');
const logOperazioniService = require('../logOperazioni/logOperazioni.service');

/*
    ROUTES
*/
router.get('/', authorize(), getListaChecklistTemplate);
router.post('/inserisci', authorize(), registrazioneValidation, inserisciCheckListTemplate);
router.get('/:id', authorize(), getCheckListTemplateById);
router.put('/:id', authorize(), aggiornamentoValidation, aggiornaCheckListTemplate);
router.delete('/:id', authorize(), deleteValidation, eliminaLogicamenteCheckListTemplate);

module.exports = router;

//  Funzione per recuperare la lista dei template di checklist
function getListaChecklistTemplate(req, res, next) {
    checkListTemplateService.getListaChecklistTemplate()
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per l'inserimento di un nuovo template di checklist
function registrazioneValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        veicoloIdentificativo: Joi.number().required(),
        userInsert: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per registrare un nuovo template di checklist
function inserisciCheckListTemplate(req, res, next) {
    checkListTemplateService.inserisciChecklistTemplate(req.body)
        .then(() => res.json({ message: 'Template di checklist inserito con successo' }))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare un singolo template di checklist
function getCheckListTemplateById(req, res, next) {
    checkListTemplateService.getChecklistTemplate(req.params.id)
        .then(user => res.json(user))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per aggiornare template di checklist
function aggiornamentoValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        veicoloIdentificativo: Joi.number(),
        userUpdate: Joi.string().required(),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per aggiorare template di checklist
function aggiornaCheckListTemplate(req, res, next) {
    checkListTemplateService.aggiornaChecklistTemplate(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

//  Funzione per validare la cancellazione di template di checklist
function deleteValidation(req, res, next) {
    const schema = Joi.object({
        identificativo: Joi.number().equal(req.params.id),
        userDelete: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per eliminare logicamente template di checklist
function eliminaLogicamenteCheckListTemplate(req, res, next) {
    checkListTemplateService.cancellaLogicamenteVeicolo(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}














































