const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        identificativo: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        //AGGIUNGERE CODICE CHECKLIST
        nome: { type: DataTypes.STRING, allowNull: false },
        descrizione: { type: DataTypes.STRING, allowNull: true },
        quantita: { type: DataTypes.INTEGER, allowNull: false },
        userInsert: { type: DataTypes.STRING, allowNull: false },
        dateInsert: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        userUpdate: { type: DataTypes.STRING, allowNull: true },
        dateUpdate: { type: 'DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)' },
        userDelete: { type: DataTypes.STRING, allowNull: true },
        dateDelete: { type: DataTypes.DATE, allowNull: true },
    };

    const options = {
        tableName: 'riga-checklist-template',
        timestamps: false,
    };


    return sequelize.define('rigaChecklistTemplate', attributes, options,);
}