'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Lophocphan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Lophocphan.init(
        {
            lhpId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            teacherId: DataTypes.INTEGER,
            state: DataTypes.BOOLEAN,
            quantityOfstudents: DataTypes.INTEGER,
            quantityoftinchi: DataTypes.INTEGER,
            tuition: DataTypes.INTEGER,
        },
        {
            sequelize,

            modelName: 'Lophocphans',
            tableName: 'lophocphan',
            timestamps: false, // Disable createdAt and updatedAt
            defaultScope: {
                raw: true,
            },
        },
    );
    return Lophocphan;
};
