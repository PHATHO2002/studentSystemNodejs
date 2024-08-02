'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudentsOfLophocPhan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    StudentsOfLophocPhan.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            svId: {
                type: DataTypes.INTEGER,
            },
            lhpId: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,

            modelName: 'StudentsOfLophocPhan',
            tableName: 'StudentsOfLophocPhan',
            timestamps: false, // Disable createdAt and updatedAt
            defaultScope: {
                raw: true,
            },
        },
    );
    return StudentsOfLophocPhan;
};
