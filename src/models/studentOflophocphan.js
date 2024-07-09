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
            svId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            lhpId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
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
