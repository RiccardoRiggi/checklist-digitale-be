const db = require('_helpers/db');


module.exports = {
   create,
};

async function create(params) {
    await db.LogAutenticazione.create(params);
}
