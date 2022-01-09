const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const rigaCheckListTemplateService = require('./rigachecklisttemplate.service');
const logOperazioniService = require('../logOperazioni/logOperazioni.service');

/*
    ROUTES
*/
router.get('/lista/:id', authorize(), getListaRigaChecklistTemplate);
router.post('/inserisci', authorize(), registrazioneValidation, inserisciRigaCheckListTemplate);
router.get('/:id', authorize(), getRigaCheckListTemplateById);
router.put('/:id', authorize(), aggiornamentoValidation, aggiornaRigaCheckListTemplate);
router.delete('/:id', authorize(), deleteValidation, eliminaLogicamenteRigaCheckListTemplate);

module.exports = router;

//  Funzione per recuperare la lista dei template di riga checklist
function getListaRigaChecklistTemplate(req, res, next) {
    rigaCheckListTemplateService.getListaRigaChecklistTemplate(req.params.id)
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per l'inserimento di un nuovo template di riga checklist
function registrazioneValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        descrizione: Joi.string().required(),
        quantita: Joi.number().required(),
        checklistTemplateIdentificativo: Joi.number().required(),
        userInsert: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per registrare un nuovo template di riga checklist
function inserisciRigaCheckListTemplate(req, res, next) {
    rigaCheckListTemplateService.inserisciRigaChecklistTemplate(req.body)
        .then(() => res.json({ message: 'Template di riga checklist inserito con successo' }))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare un singolo template di riga checklist
function getRigaCheckListTemplateById(req, res, next) {
    rigaCheckListTemplateService.getRigaChecklistTemplate(req.params.id)
        .then(user => res.json(user))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per aggiornare template di riga checklist
function aggiornamentoValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        descrizione: Joi.string().required(),
        quantita: Joi.number().required(),
        checklistTemplateIdentificativo: Joi.number().required(),
        userUpdate: Joi.string().required(),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per aggiorare template di riga checklist
function aggiornaRigaCheckListTemplate(req, res, next) {
    rigaCheckListTemplateService.aggiornaRigaChecklistTemplate(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

//  Funzione per validare la cancellazione di template di riga checklist
function deleteValidation(req, res, next) {
    const schema = Joi.object({
        identificativo: Joi.number().equal(req.params.id),
        userDelete: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per eliminare logicamente template di riga checklist
function eliminaLogicamenteRigaCheckListTemplate(req, res, next) {
    rigaCheckListTemplateService.cancellaLogicamenteRigaChecklistTemplate(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}














































