'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Teacher.init(
        {
            teacherId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            accountName: DataTypes.STRING,
            LastName: DataTypes.STRING,
            FirstName: DataTypes.STRING,

            password: DataTypes.STRING,
            role: DataTypes.STRING,

            majorCode: DataTypes.STRING,
        },
        {
            sequelize,

            modelName: 'Teachers',
            tableName: 'Teacher',
            timestamps: false, // Disable createdAt and updatedAt
            defaultScope: {
                raw: true,
            },
        },
    );
    return Teacher;
};
