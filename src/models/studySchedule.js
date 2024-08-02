'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudySchedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    StudySchedule.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            date: {
                type: DataTypes.DATE,
            },
            startTime: {
                type: DataTypes.STRING,
            },
            quantityOftiet: {
                type: DataTypes.INTEGER,
            },
            lhpId: {
                type: DataTypes.INTEGER,
            },
            endTime: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,

            modelName: 'StudySchedule',
            tableName: 'studySchedule',
            timestamps: false, // Disable createdAt and updatedAt

            defaultScope: {
                raw: true,
            },
            removeAttr: 'id',
        },
    );
    return StudySchedule;
};
