const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        identificativo: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        codiceUtente:{type: DataTypes.STRING, allowNull: false},
        urlProvenienza:{type: DataTypes.STRING, allowNull: false},
        rawData:{type: DataTypes.STRING, allowNull: false},
        dataOraEvento:{type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')},
    };

    const options = {
        tableName: 'log-operazioni',
        timestamps: false,
    };

   
    return sequelize.define('logOperazioni', attributes, options,);
}