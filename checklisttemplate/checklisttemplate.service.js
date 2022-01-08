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

//  Funzione che restituisce la lista dei veicoli
async function getListaChecklistTemplate() {
    console.log(db);
    return await db.Checklistemplate.findAll({ where: { dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo veicolo
async function getChecklistTemplate(id) {
    const user = await db.Checklistemplate.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!user) throw 'Checklist Template non trovato';
    return user;
}

//  Funzione che inserisce un nuovo template checklist
async function inserisciChecklistTemplate(params) {
    await db.Checklistemplate.create(params);
}

//  Funzione che aggiorna template di checklist
async function aggiornaChecklistTemplate(id, params) {
    const user = await getChecklistTemplate(id);

    const selettivaCambiata = params.selettiva && user.selettiva !== params.selettiva;
    if (selettivaCambiata && await db.Checklistemplate.findOne({ where: { selettiva: params.selettiva, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } })) {
        throw 'Selettiva "' + params.selettiva + '" già in uso';
    }

    Object.assign(user, params);
    await user.save();
    return user.get();
}

//  Funzione che cancella logicamente template di checklist
async function cancellaLogicamenteChecklistTemplate(id, params) {
    const user = await getChecklistTemplate(id);
    Object.assign(user, params);
    user.dateDelete=Date.now();
    await user.save();
    return user.get();
}
