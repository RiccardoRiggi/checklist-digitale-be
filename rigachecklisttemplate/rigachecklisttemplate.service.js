const db = require('_helpers/db');
const Op = require('sequelize').Op;

//  Esporto le seguenti funzioni
module.exports = {
    
    getListaRigaChecklistTemplate,
    getRigaChecklistTemplate,
    inserisciRigaChecklistTemplate,
    aggiornaRigaChecklistTemplate,
    cancellaLogicamenteRigaChecklistTemplate
};

//  Funzione che restituisce la lista dei veicoli
async function getListaRigaChecklistTemplate(id) {
    return await db.RigaChecklistemplate.findAll({ where: {checklistTemplateIdentificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo veicolo
async function getRigaChecklistTemplate(id) {
    const user = await db.RigaChecklistemplate.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!user) throw 'Riga Checklist Template non trovato';
    return user;
}

//  Funzione che inserisce un nuovo template checklist
async function inserisciRigaChecklistTemplate(params) {
    await db.RigaChecklistemplate.create(params);
}

//  Funzione che aggiorna template di checklist
async function aggiornaRigaChecklistTemplate(id, params) {
    const user = await getRigaChecklistTemplate(id);
    Object.assign(user, params);
    await user.save();
    return user.get();
}

//  Funzione che cancella logicamente template di checklist
async function cancellaLogicamenteRigaChecklistTemplate(id, params) {
    const user = await getRigaChecklistTemplate(id);
    Object.assign(user, params);
    user.dateDelete=Date.now();
    await user.save();
    return user.get();
}
