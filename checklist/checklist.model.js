const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        identificativo: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        nome:{type: DataTypes.STRING, allowNull: false},
        note:{type: DataTypes.STRING, allowNull: true},
        isCompletato:{type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        userInsert:{type: DataTypes.STRING, allowNull: false},
        dateInsert:{type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
        userUpdate:{type: DataTypes.STRING, allowNull: true},
        dateUpdate:{type: 'DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'},
        userDelete:{type: DataTypes.STRING, allowNull: true},
        dateDelete:{type: DataTypes.DATE, allowNull: true},
    };

    const options = {
        tableName: 'checklist',
        timestamps: false,
    };

   
    return sequelize.define('checklist', attributes, options,);
}