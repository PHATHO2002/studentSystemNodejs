const db = require('../models/index');
const teacherService = {
    createLhp: (lhpdata) => {
        return new Promise(async (resolve, reject) => {
            const { name, state, quantityOfstudents, quantityoftinchi } = lhpdata;
            if (name && state && quantityOfstudents && quantityoftinchi) {
                try {
                    const lophocphan = await db.Lophocphans.create({
                        name: name,
                        teacherId: lhpdata.teacherId,
                        state: Number(state),
                        quantityOfstudents: quantityOfstudents,
                        quantityoftinchi: quantityoftinchi,
                    });
                    resolve({ errCode: 0, message: 'Tạo lớp học phần thành công', data: lophocphan });
                } catch (err) {
                    throw err;
                }
            } else {
                reject({ errCode: 1, message: 'chưa nhập dữ liệu', data: null });
            }
        });
    },
    getListLhp: (teacherId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const lophocphans = await db.Lophocphans.findAll({
                    where: {
                        teacherID: teacherId,
                    },
                });

                if (lophocphans.length > 0) {
                    resolve({ errCode: 0, message: 'Lấy lớp học phần thành công', data: lophocphans });
                } else {
                    resolve({ errCode: 1, message: 'Chưa tạo lớp nào', data: null });
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách lớp học phần:', error);
                reject(error);
            }
        });
    },
};
module.exports = teacherService;
