const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        identificativo: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        nome:{type: DataTypes.STRING, allowNull: false},
        cognome:{type: DataTypes.STRING, allowNull: false},
        dataDiNascita:{type: DataTypes.DATEONLY, allowNull: false},
        email:{type: DataTypes.STRING, allowNull: false},
        password:{type: DataTypes.STRING, allowNull: false},
        userInsert:{type: DataTypes.STRING, allowNull: false},
        dateInsert:{type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
        userUpdate:{type: DataTypes.STRING, allowNull: true},
        dateUpdate:{type: 'DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'},
        userDelete:{type: DataTypes.STRING, allowNull: true},
        dateDelete:{type: DataTypes.DATE, allowNull: true},
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