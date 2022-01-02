const { raw } = require('body-parser');
const db = require('_helpers/db');


module.exports = {
    registraLogOperazione,
};

async function registraLogOperazione(codiceUtenteInput,rawDataInput) {
    const pojo = {
        codiceUtente:codiceUtenteInput,
        rawData:rawDataInput
    }
    await db.LogOperazioni.create(pojo);
}
