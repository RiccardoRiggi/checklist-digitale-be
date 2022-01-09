const db = require('_helpers/db');
const Op = require('sequelize').Op;

//  Esporto le seguenti funzioni
module.exports = {
    
    getListaChecklistTemplate,
    getChecklistTemplate,
    inserisciChecklistTemplate,
    aggiornaChecklistTemplate,
    cancellaLogicamenteVeicolo: cancellaLogicamenteChecklistTemplate
};

//  Funzione che restituisce la lista dei template delle checklist
async function getListaChecklistTemplate() {
    return await db.Checklistemplate.findAll({ where: { dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo template di checklist
async function getChecklistTemplate(id) {
    const checklistTrovata = await db.Checklistemplate.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!checklistTrovata) throw 'Checklist Template non trovato';
    return checklistTrovata;
}

//  Funzione che inserisce un nuovo template checklist
async function inserisciChecklistTemplate(params,utente) {
    if(utente.tRuoloCodice!='A')
        throw 'Accesso negato perché non disponi dei privilegi sufficienti';
    await db.Checklistemplate.create(params);
}

//  Funzione che aggiorna template di checklist
async function aggiornaChecklistTemplate(id, params,utente) {
    
    if(utente.tRuoloCodice!='A')
        throw 'Accesso negato perché non disponi dei privilegi sufficienti';

    const checklistTrovata = await getChecklistTemplate(id);
    Object.assign(checklistTrovata, params);
    await checklistTrovata.save();
    return checklistTrovata.get();
}

//  Funzione che cancella logicamente template di checklist
async function cancellaLogicamenteChecklistTemplate(id, params,utente) {
    if(utente.tRuoloCodice!='A')
        throw 'Accesso negato perché non disponi dei privilegi sufficienti';
    const checklistTrovata = await getChecklistTemplate(id);
    Object.assign(checklistTrovata, params);
    checklistTrovata.dateDelete=Date.now();
    await checklistTrovata.save();
    return checklistTrovata.get();
}
