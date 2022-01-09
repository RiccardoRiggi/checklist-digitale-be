const db = require('_helpers/db');
const Op = require('sequelize').Op;
const rigaChecklistTemplateService = require('../rigachecklisttemplate/rigachecklisttemplate.service');
const rigaChecklistService = require('../rigachecklist/rigachecklist.service');

//  Esporto le seguenti funzioni
module.exports = {

    getListaChecklist,
    getChecklist,
    inserisciChecklist,
    aggiornaChecklist,
    cancellaLogicamenteChecklist,
    getListaChecklistDaCompletare,
    getListaChecklistCompletate,
    confermaChecklist
};

//  Funzione che restituisce la lista dei veicoli
async function getListaChecklist() {
    return await db.Checklist.findAll({ where: { dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}


//  Funzione che restituisce la lista dei veicoli
async function getListaChecklistDaCompletare(veicoloIdentificativo) {
    return await db.Checklist.findAll({ where: { veicoloIdentificativo: veicoloIdentificativo, isCompletato: false, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce la lista dei veicoli
async function getListaChecklistCompletate(veicoloIdentificativo) {
    return await db.Checklist.findAll({ where: { veicoloIdentificativo: veicoloIdentificativo, isCompletato: true, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo veicolo
async function getChecklist(id) {
    const user = await db.Checklist.findOne({ where: { identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!user) throw 'Checklist  non trovato';
    return user;
}

//  Funzione che inserisce un nuovo  checklist
async function inserisciChecklist(params) {
    oggetto = await db.Checklist.create(params);
    listaRigheDaInserire = await rigaChecklistTemplateService.getListaRigaChecklistTemplate(params.checklistTemplateIdentificativo);

    listaRigheDaInserire.forEach(element => {
        elementoDaInserire = element.dataValues;
        elementoDaInserire.identificativo = undefined;
        elementoDaInserire.quantitaRiferimento = elementoDaInserire.quantita;
        elementoDaInserire.quantita = undefined;
        elementoDaInserire.checklistIdentificativo = oggetto.dataValues.identificativo;
        elementoDaInserire.userInsert = params.userInsert;
        rigaChecklistService.inserisciRigaChecklist(elementoDaInserire);
    });

}

//  Funzione che aggiorna una checklist
async function aggiornaChecklist(id, params) {
    const checklistTrovata = await getChecklist(id);

    if (checklistTrovata.isCompletato)
        throw 'Impossibile modificare una checklist completata!';

    Object.assign(checklistTrovata, params);
    await checklistTrovata.save();
    return checklistTrovata.get();
}

//  Funzione che marca una checklist come completata
async function confermaChecklist(id, params) {
    const chechlistTrovata = await getChecklist(id);
    listaRighe = await rigaChecklistService.getListaRigaChecklist(id);
    listaRighe.forEach(element => {
        if (!element.dataValues.isConfermato)
            throw 'Errore, non sono state confermate tutte le righe!';

    });

    Object.assign(chechlistTrovata, params);
    await chechlistTrovata.save();
    return chechlistTrovata.get();
}

//  Funzione che cancella logicamente una checklist
async function cancellaLogicamenteChecklist(id, params) {
    const checklistTrovata = await getChecklist(id);
    if (checklistTrovata.isCompletato)
        throw 'Impossibile cancellare una checklist completata!';

    rigaChecklistService.cancellaLogicamenteTutteLeRigheChecklist(id,params.userDelete);

    Object.assign(checklistTrovata, params);
    checklistTrovata.dateDelete = Date.now();
    await checklistTrovata.save();
    return checklistTrovata.get();
}
