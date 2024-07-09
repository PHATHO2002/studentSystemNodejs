'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Student.init(
        {
            svId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            accountName: DataTypes.STRING,
            LastName: DataTypes.STRING,
            FirstName: DataTypes.STRING,
            birtday: DataTypes.DATE,
            adress: DataTypes.STRING,
            password: DataTypes.STRING,
            sex: DataTypes.STRING,
            avatar: DataTypes.STRING,
            majorCode: DataTypes.STRING,
            makhoa: DataTypes.INTEGER,
            classCode: DataTypes.STRING,
            role: DataTypes.STRING,
        },
        {
            sequelize,

            modelName: 'Students',
            tableName: 'Student',
            defaultScope: {
                raw: true,
            },
        },
    );
    return Student;
};
