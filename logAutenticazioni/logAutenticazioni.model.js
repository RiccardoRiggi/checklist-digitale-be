const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        identificativo: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        email:{type: DataTypes.STRING, allowNull: false},
        dataOraEvento:{type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')},
    };

    const options = {
        tableName: 'log-autenticazioni',
        timestamps: false,
    };

   
    return sequelize.define('logAutenticazioni', attributes, options,);
}