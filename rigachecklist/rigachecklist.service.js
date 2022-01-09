const db = require('_helpers/db');
const Op = require('sequelize').Op;

//  Esporto le seguenti funzioni
module.exports = {
    
    getListaRigaChecklist,
    getRigaChecklist,
    inserisciRigaChecklist,
    aggiornaRigaChecklist,
    cancellaLogicamenteRigaChecklist,
    cancellaLogicamenteTutteLeRigheChecklist
};

//  Funzione che restituisce la lista delle righe dato il codice di una checklist
async function getListaRigaChecklist(id) {
    return await db.RigaChecklist.findAll({ where: {checklistIdentificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce una singola riga
async function getRigaChecklist(id) {
    const rigaTrovata = await db.RigaChecklist.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!rigaTrovata) throw 'Riga non trovata';
    return rigaTrovata;
}

//  Funzione che inserisce una nuova riga di checklist
async function inserisciRigaChecklist(params) {
    await db.RigaChecklist.create(params);
}

//  Funzione che aggiorna una riga di checklist
async function aggiornaRigaChecklist(id, params) {
    const rigaTrovata = await getRigaChecklist(id);
    if(rigaTrovata.isConfermato)
        throw 'Non è possibile modificare una riga già confermata!';
    Object.assign(rigaTrovata, params);
    await rigaTrovata.save();
    return rigaTrovata.get();
}

//  Funzione che cancella logicamente una singola riga di checklist
async function cancellaLogicamenteRigaChecklist(id, params) {
    const rigaTrovata = await getRigaChecklist(id);
    Object.assign(rigaTrovata, params);
    rigaTrovata.dateDelete=Date.now();
    await rigaTrovata.save();
    return rigaTrovata.get();
}

//  Funzione che cancella logicamente tutte le righe di una checklist
async function cancellaLogicamenteTutteLeRigheChecklist(id,userDelete) {
    await db.RigaChecklist.update({
        userDelete:userDelete,
        dateDelete:Date.now(),
      }, {
        where: { checklistIdentificativo: id },
        returning: true,
        plain: true
      });
}

