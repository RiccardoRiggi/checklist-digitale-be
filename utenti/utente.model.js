const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        idUtente: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        nome:{type: DataTypes.STRING, allowNull: false},
        cognome:{type: DataTypes.STRING, allowNull: false},
        dataNascita:{type: DataTypes.DATEONLY, allowNull: true},
        sesso:{type: DataTypes.STRING, allowNull: true},
        email:{type: DataTypes.STRING, allowNull: false},
        telefono:{type: DataTypes.STRING, allowNull: true},
        password:{type: DataTypes.STRING, allowNull: false},
        impronta:{type: DataTypes.STRING, allowNull: true},
        dataUltimoAccesso:{type: DataTypes.DATE, allowNull: true},
        idRuolo:{type: DataTypes.INTEGER, allowNull: true},
        dataCreazione:{type: DataTypes.DATE, allowNull: false},
        utenteCreazione:{type: DataTypes.STRING, allowNull: false},
        dataAggiornamento:{type: DataTypes.DATE, allowNull: true},
        utenteAggiornamento:{type: DataTypes.STRING, allowNull: true},
        dataEliminazione:{type: DataTypes.DATE, allowNull: true},
        utenteEliminazione:{type: DataTypes.STRING, allowNull: true},
    };

    const options = {

        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['password'] },
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        },
        tableName: 'utenti',
        timestamps: false,
    };

   
    return sequelize.define('utente', attributes, options,);
}