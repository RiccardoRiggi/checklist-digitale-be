const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const checkListService = require('./checklist.service');
const logOperazioniService = require('../logOperazioni/logOperazioni.service');

router.get('/', authorize(), getListaChecklist);
router.get('/listaCompletatePerVeicolo/:id', authorize(), getListaChecklistCompletate);
router.get('/listaDaCompletarePerVeicolo/:id', authorize(), getListaChecklistDaCompletare);
router.post('/inserisci', authorize(), registrazioneValidation, inserisciCheckList);
router.get('/:id', authorize(), getCheckListById);
router.put('/:id', authorize(), aggiornamentoValidation, aggiornaCheckList);
router.put('/conferma/:id', authorize(), confermaValidation, confermaChecklist);
router.delete('/:id', authorize(), deleteValidation, eliminaLogicamenteCheckList);

module.exports = router;

//  Funzione per recuperare la lista di tutte le checklist
function getListaChecklist(req, res, next) {
    checkListService.getListaChecklist()
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare la lista delle checklist completate dato un veicolo
function getListaChecklistCompletate(req, res, next) {
    checkListService.getListaChecklistCompletate(req.params.id)
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare la lista delle checklist da completare dato un veicolo
function getListaChecklistDaCompletare(req, res, next) {
    checkListService.getListaChecklistDaCompletare(req.params.id)
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per l'inserimento di una nuova checklist
function registrazioneValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        note: Joi.string(),
        veicoloIdentificativo: Joi.number().required(),
        userInsert: Joi.string().required(),
        checklistTemplateIdentificativo: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per registrare una nuova checklist
function inserisciCheckList(req, res, next) {
    checkListService.inserisciChecklist(req.body)
        .then(() => res.json({ message: 'Checklist inserita con successo' }))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare una singola checklist
function getCheckListById(req, res, next) {
    checkListService.getChecklist(req.params.id)
        .then(user => res.json(user))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per aggiornare una checklist
function aggiornamentoValidation(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        note: Joi.string(),
        userUpdate: Joi.string().required(),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per aggiorare una checklist
function aggiornaCheckList(req, res, next) {
    checkListService.aggiornaChecklist(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

//  Funzione per validare la cancellazione di una checklist
function deleteValidation(req, res, next) {
    const schema = Joi.object({
        identificativo: Joi.number().equal(req.params.id),
        userDelete: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

//  Funzione per eliminare logicamente una checklist
function eliminaLogicamenteCheckList(req, res, next) {
    checkListService.cancellaLogicamenteChecklist(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

//  Funzione per validare gli input per confermare la checklist
function confermaValidation(req, res, next) {
    const schema = Joi.object({
        isCompletato: Joi.boolean().required(),
        userUpdate: Joi.string().required(),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per confermare la checklist e non renderla più modificabile
function confermaChecklist(req, res, next) {
    checkListService.confermaChecklist(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}














































