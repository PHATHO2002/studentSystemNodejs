const db = require('../models/index');

const studentService = {
    getListLhp_open: (svId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const registedLhps = await db.StudentsOfLophocPhan.findAll({
                    // những học phần đã đăng kys
                    where: {
                        svId: svId,
                    },
                    attributes: ['lhpId'],
                });
                const lophocphans = await db.Lophocphans.findAll({
                    where: {
                        state: 1,
                    },
                });
                let unregisteredLhp = lophocphans.filter((item) => !registedLhps.includes(item.lhpId)); // lọc ra những học phần chưa đăng ký
                if (unregisteredLhp.length > 0) {
                    for (let i = 0; i < unregisteredLhp.length; i++) {
                        let quantityOfRegistered = await db.StudentsOfLophocPhan.count({
                            where: {
                                lhpId: unregisteredLhp[i].lhpId,
                            },
                        });
                        unregisteredLhp[i].quantityOfRegisteredStudent = quantityOfRegistered;
                    }

                    resolve({ errCode: 0, message: 'Lấy lớp học phần thành công', data: unregisteredLhp });
                } else {
                    resolve({ errCode: 1, message: 'Chưa có học phần nào mở', data: null });
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách lớp học phần mở:', error);
                reject(error);
            }
        });
    },
    registerLhp: (svId, lhpId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let registedStudent = await db.StudentsOfLophocPhan.create({
                    svId: svId,
                    lhpId: lhpId,
                });
                if (registedStudent) {
                    resolve({ errCode: 0, message: 'đăng ký lớp học phần thành công', data: registedStudent });
                } else {
                    resolve({ errCode: 1, message: 'đăng ký lớp học phần thất bại', data: registedStudent });
                }
            } catch (error) {
                console.log('lỗi đăng ký học phần', error);
                reject('lỗi sever nội bộ');
            }
        });
    },
};
module.exports = studentService;
