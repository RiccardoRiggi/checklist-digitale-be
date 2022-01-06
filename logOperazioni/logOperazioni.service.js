const { raw } = require('body-parser');
const db = require('_helpers/db');


module.exports = {
    registraLogOperazione,
};

async function registraLogOperazione(urlProvenienzaInput,codiceUtenteInput,rawDataInput) {
    const pojo = {
        codiceUtente:codiceUtenteInput,
        rawData:rawDataInput,
        urlProvenienza:urlProvenienzaInput
    }
    await db.LogOperazioni.create(pojo);
}
