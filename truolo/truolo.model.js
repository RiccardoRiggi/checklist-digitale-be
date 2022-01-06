const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        codice: { type: DataTypes.STRING, allowNull: false, primaryKey: true},
        descrizione:{type: DataTypes.STRING, allowNull: false},
    };

    const options = {
        tableName: 't_ruolo',
        timestamps: false,
    };

   
    return sequelize.define('tRuolo', attributes, options,);
}