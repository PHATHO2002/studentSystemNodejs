'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Nienkhoa extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Nienkhoa.init(
        {
            makhoa: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
        },
        {
            sequelize,

            modelName: 'Nienkhoa',
            tableName: 'Nienkhoa',
            defaultScope: {
                raw: true,
            },
        },
    );
    return Nienkhoa;
};
