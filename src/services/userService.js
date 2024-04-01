const db = require('../config/database');
let randomString = (length) => {
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
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT makhoa
                FROM Nienkhoa ORDER BY makhoa ASC;`,
            (err, results) => {
                if (err) {
                    throw err;
                } else {
                    resolve(results[results.length - 1].makhoa);
                }
            },
        );
    });
};
let Mssv = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT zero_thousand
                FROM array ORDER By zero_thousand ASC;`,
            (err, results) => {
                if (err) {
                    throw err;
                } else {
                    let arr = [];
                    for (let i = 0; i < results.length; i++) {
                        arr.push(results[i].zero_thousand);
                    }

                    resolve(arr[0]);
                }
            },
        );
    });
};
let reduceNumber = (mssvWasCreated) => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM array
            WHERE zero_thousand = ${mssvWasCreated};`,
            (err, results) => {
                if (err) {
                    throw err;
                } else {
                    resolve(true);
                }
            },
        );
    });
};
let getCurrentYear = () => {
    return new Promise((resolve, reject) => {
        let currentDate = new Date();
        // Lấy ra năm hiện tại từ đối tượng Date

        resolve(currentDate.getFullYear());
    });
};
class UserService {
    createUser(data) {
        return new Promise(async (resolve, reject) => {
            let { lName, fName, date, adress, sex, avatarCloud, major } = data;
            let psw = await randomString(8);
            let nienkhoa = await Nienkhoa();
            let orderSv = await Mssv();
            if (!orderSv) {
                reject({ errCode: 1, message: 'full student', data: {} });
            } else {
                let mssv = (await getCurrentYear()) + orderSv.toString().padStart(3, '0');
                db.query(
                    `INSERT INTO Student (mssv, LastName,FirstName,birtday,adress,sex,password,avatar,majorCode,makhoa)
                            VALUES ('${mssv}','${lName}','${fName}','${date}','${adress}','${Number(sex)}','${psw}','${avatarCloud}','${major}','${nienkhoa}')`,
                    async (err, results) => {
                        if (err) {
                            throw err;
                        } else {
                            let isreduceNumber = await reduceNumber(orderSv);
                            if (isreduceNumber) {
                                resolve({ errCode: 0, message: 'register successfully', data: { mssv, psw } });
                            }
                        }
                    },
                );
            }
        });
    }
    login(data) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * 
                    FROM Student 
                    WHERE mssv = '${data.mssv}' AND password ='${data.psw}';`,
                (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        if (results.length > 0) {
                            resolve({ errCode: 0, message: 'login successfully', data: results });
                        } else {
                            reject({ errCode: 1, message: 'psw or mssv is wrong', data: results });
                        }
                    }
                },
            );
        });
    }
}

module.exports = new UserService();
