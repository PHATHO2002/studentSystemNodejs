const db = require('../models/index');
const randomString = (length) => {
    return new Promise((resolve, reject) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        resolve(result);
    });
};
// lay ra niên khóa hiện tại
let Nienkhoa = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db.Nienkhoa.findOne({
                attributes: ['makhoa'],
                order: [['makhoa', 'DESC']],
            });

            if (!result) {
                reject('No data found');
            }

            resolve(result.makhoa);
        } catch (err) {
            reject(err);
            // Xử lý lỗi tại đây nếu cần
        }
    });
};

const UserService = {
    createUser: (studentData) => {
        return new Promise(async (resolve, reject) => {
            let { accountName, lName, fName, date, adress, sex, avatarCloud, major } = studentData;
            if (accountName && lName && fName && date && adress && sex && avatarCloud && major) {
                try {
                    let psw = await randomString(8);
                    let nienkhoa = await Nienkhoa();
                    try {
                        const student = await db.Students.create({
                            accountName: accountName,
                            LastName: lName,
                            FirstName: fName,
                            birtday: date,
                            adress: adress,
                            sex: Number(sex),
                            password: psw,
                            avatar: avatarCloud,
                            majorCode: major,
                            makhoa: nienkhoa,
                        });
                        if (student) {
                            resolve({ errCode: 0, message: 'đăng ký thành công', data: { accountName, psw } });
                        }
                    } catch (err) {
                        if (err.parent.code == 'ER_DUP_ENTRY') {
                            resolve({ errCode: 2, message: `${accountName} đã có người sử dụng!`, data: studentData });
                        } else throw err;
                    }
                } catch (error) {
                    reject({
                        message: 'error at createUser UserService',
                        details: error,
                    });
                }
            } else {
                resolve({ errCode: 3, message: 'chưa nhập dữ liệu', data: null });
            }
        });
    },
    login: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user;
                if (data.position == '1') {
                    user = await db.Students.findOne({
                        where: {
                            accountName: data.accountName,
                            password: data.psw,
                        },
                        attributes: { exclude: ['password'] },
                    });
                    if (user) {
                        user.isStudent = true;
                        resolve({ errCode: 0, message: 'Đăng nhập thành công', data: user });
                    } else {
                        resolve({ errCode: 1, message: 'tên đăng nhập hoặc mật khẩu sai', data: null });
                    }
                } else if (data.position == '2') {
                    user = await db.Teachers.findOne({
                        where: {
                            accountName: data.accountName,
                            password: data.psw,
                        },
                        attributes: { exclude: ['password'] },
                    });
                }

                if (user) {
                    resolve({ errCode: 0, message: 'Đăng nhập thành công', data: user });
                } else {
                    resolve({ errCode: 1, message: 'tên đăng nhập hoặc mật khẩu sai', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at login UserService',
                    details: error,
                });
            }
        });
    },
    changePsw: (userData, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user;
                if (userData.role == '1') {
                    user = await db.Students.findOne({
                        where: {
                            accountName: userData.accountName,
                            password: data.curentPsw,
                        },
                        attributes: ['password'], // Chỉ bao gồm trường 'password'
                    });
                } else if (userData.role == '2') {
                    user = await db.Teachers.findOne({
                        where: {
                            accountName: userData.accountName,
                            password: data.curentPsw,
                        },
                        attributes: ['password'], // Chỉ bao gồm trường 'password'
                    });
                }

                if (data) {
                    if (user) {
                        if (data.newPsw !== data.confirmPsw) {
                            resolve({ errCode: 3, message: 'Mật khẩu nhập lại ko trùng hợp', data: userData });
                        }
                        if (userData.role == '1') {
                            await db.Students.update(
                                { password: data.newPsw },
                                {
                                    where: {
                                        accountName: userData.accountName,
                                    },
                                },
                            );
                        } else if (userData.role == '2') {
                            await db.Teachers.update(
                                { password: data.newPsw },
                                {
                                    where: {
                                        accountName: userData.accountName,
                                    },
                                },
                            );
                        }

                        resolve({ errCode: 0, message: 'Đổi mật khẩu thành công', data: userData });
                    } else {
                        resolve({ errCode: 2, message: 'Nhập sai mật khẩu hiện tại', data: userData });
                    }
                } else {
                    resolve({ errCode: 1, message: 'Chưa Nhập dữ liệu', data: userData });
                }
            } catch (error) {
                reject({
                    message: 'error at changePsw UserService',
                    details: error,
                });
            }
        });
    },
};

module.exports = UserService;
