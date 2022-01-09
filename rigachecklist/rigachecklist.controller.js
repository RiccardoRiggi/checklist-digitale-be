const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const rigaCheckListService = require('./rigachecklist.service');
const logOperazioniService = require('../logOperazioni/logOperazioni.service');

router.get('/lista/:id', authorize(), getListaRigaChecklist);
router.get('/:id', authorize(), getRigaCheckListById);
router.put('/:id', authorize(), aggiornamentoValidation, aggiornaRigaCheckList);

module.exports = router;

//  Funzione per recuperare la lista delle righe data una checklist
function getListaRigaChecklist(req, res, next) {
    rigaCheckListService.getListaRigaChecklist(req.params.id)
        .then(users => res.json(users))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per recuperare una singola riga
function getRigaCheckListById(req, res, next) {
    rigaCheckListService.getRigaChecklist(req.params.id)
        .then(user => res.json(user))
        .catch(next);
    logOperazioniService.registraLogOperazione(req.originalUrl, req.user.identificativo, JSON.stringify(req.body));
}

//  Funzione per validare gli input per aggiornare una riga di checklist
function aggiornamentoValidation(req, res, next) {
    const schema = Joi.object({
        note: Joi.string(),
        isConfermato: Joi.boolean(),
        checklistIdentificativo: Joi.number().required(),
        userUpdate: Joi.string().required(),
        identificativo: Joi.number().equal(req.params.id)
    });
    validateRequest(req, next, schema);
}

//  Funzione per aggiorare una riga di checklist
function aggiornaRigaCheckList(req, res, next) {
    rigaCheckListService.aggiornaRigaChecklist(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}