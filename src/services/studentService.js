const { DATE } = require('sequelize');
const db = require('../models/index');
const getNameOfLhp = async (lhpId) => {
    let name = await db.Lophocphans.findOne({
        where: {
            lhpId: lhpId,
        },
        attributes: ['name'],
    });
    return name;
};
const getDayOfWeekString = (dayNumber) => {
    switch (dayNumber) {
        case 1:
            return 'Thứ Hai';
            break;
        case 2:
            return 'Thứ ba';
            break;
        case 3:
            return 'Thứ tư';
            break;
        case 4:
            return 'Thứ năm';
            break;
        case 5:
            return 'Thứ sáu';
            break;
        case 6:
            return 'Thứ bảy';
            break;
    }
};
const studentStudentService = {
    getListLhp_open: (svId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const registedLhpId = await db.StudentsOfLophocPhan.findAll({
                    // những học phần đã đăng kys
                    where: {
                        svId: svId,
                    },
                    attributes: ['lhpId'],
                });
                let registedLhpIdArrValue = [];
                for (let i = 0; i < registedLhpId.length; i++) {
                    registedLhpIdArrValue.push(registedLhpId[i].lhpId);
                } //take values from registedLhp to an arr

                const lophocphansOpen = await db.Lophocphans.findAll({
                    where: {
                        state: 1,
                    },
                });
                if (lophocphansOpen.length > 0) {
                    for (let i = 0; i < lophocphansOpen.length; i++) {
                        let quantityOfRegistered = await db.StudentsOfLophocPhan.count({
                            where: {
                                lhpId: lophocphansOpen[i].lhpId,
                            },
                        });
                        lophocphansOpen[i].quantityOfRegisteredStudent = quantityOfRegistered;
                    }
                    let unregisteredLhp = [];

                    unregisteredLhp = lophocphansOpen.filter((item, index) => {
                        return !registedLhpIdArrValue.includes(item.lhpId);
                    }); // lọc ra những học phần chưa đăng ký

                    if (unregisteredLhp.length > 0) {
                        resolve({
                            errCode: 0,
                            message: 'Lấy lớp học phần thành công',
                            data: unregisteredLhp,
                        });
                    } else {
                        resolve({
                            errCode: 2,
                            message: 'bạn đã đăng ký hết vui lòng sang danh sách lớp học phần đẵ đăng ký để kiểm tra !',
                            data: null,
                        });
                    }
                } else {
                    resolve({ errCode: 1, message: 'Chưa có học phần nào mở', data: null });
                }
            } catch (error) {
                console.log('error at getListLhp_open StudentService:', error);
                reject();
            }
        });
    },
    getListLhpregisted: (svId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const registedLhpId = await db.StudentsOfLophocPhan.findAll({
                    // những học phần đã đăng kys
                    where: {
                        svId: svId,
                    },
                    attributes: ['lhpId'],
                });
                let registedLhpIdArrValue = [];
                let registedLhps = [];
                for (let i = 0; i < registedLhpId.length; i++) {
                    //take values from registedLhp to an arr
                    registedLhpIdArrValue.push(registedLhpId[i].lhpId);
                }
                if (registedLhpIdArrValue.length > 0) {
                    for (let i = 0; i < registedLhpIdArrValue.length; i++) {
                        let registeredLhp = await db.Lophocphans.findOne({
                            where: {
                                lhpId: registedLhpIdArrValue[i],
                            },
                        });

                        registedLhps.push(registeredLhp);
                    }

                    resolve({
                        errCode: 0,
                        message: 'Lấy danh sách học phần đã đăng ký thành công',
                        data: registedLhps,
                    });
                } else {
                    resolve({ errCode: 1, message: 'bạn chưa đăng ký học phần nào', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getListLhpregisted StudentService',
                    details: error,
                });
            }
        });
    },
    getScheduleOfLhp: (lhpId) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (lhpId) {
                    let ScheduleOfLhp = await db.StudySchedule.findAll({
                        where: {
                            lhpId: lhpId,
                        },
                    });

                    if (ScheduleOfLhp) {
                        let NameOfLhp = await getNameOfLhp(lhpId);
                        for (const element of ScheduleOfLhp) {
                            // Phân tích chuỗi ngày thành đối tượng Date
                            const date = new Date(element.date);

                            // Lấy ngày, tháng, năm từ đối tượng Date
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                            const year = date.getFullYear();

                            // Định dạng ngày theo DD-MM-YYYY
                            const formattedDate = `${day}-${month}-${year}`;
                            element.date = formattedDate;
                        }
                        resolve({
                            errCode: 0,
                            message: 'lấy lịch học thành công',
                            data: { ScheduleOfLhp: ScheduleOfLhp, name: NameOfLhp.name },
                        });
                    } else {
                        resolve({ errCode: 2, message: 'lấy lịch học ko  thành công', data: null });
                    }
                } else {
                    resolve({ errCode: 1, message: 'chưa có lhpId', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getScheduleOfLhp StudentService',
                    details: error,
                });
            }
        });
    },
    getWeekStudySchedule: (svId, requestDate) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!svId || !requestDate.year || !requestDate.month || !requestDate.date) {
                    resolve({
                        errCode: 3,
                        message: 'thiếu dữ liệu kèm theo',
                        data: null,
                    });
                    return;
                }
                const registedLhpId = await db.StudentsOfLophocPhan.findAll({
                    // những học phần đã đăng kys
                    where: {
                        svId: svId,
                    },
                    attributes: ['lhpId'],
                });

                if (registedLhpId) {
                    let studySchduleArr = [];
                    for (const element of registedLhpId) {
                        let ScheduleOfLhp = await db.StudySchedule.findAll({
                            where: {
                                lhpId: element.lhpId,
                            },
                        });
                        let NameOfLhp = await getNameOfLhp(element.lhpId);
                        let teacherID = await db.Lophocphans.findOne({
                            where: {
                                lhpId: element.lhpId,
                            },
                            attributes: ['teacherId'],
                        });
                        let nameOfTeacher = await db.Teachers.findOne({
                            where: {
                                teacherId: teacherID.teacherId,
                            },
                            attributes: ['FirstName', 'LastName'],
                        });

                        for (const element of ScheduleOfLhp) {
                            element.name = NameOfLhp.name;
                            element.teacherName = `${nameOfTeacher.FirstName}  ${nameOfTeacher.LastName}`;
                            studySchduleArr.push(element);
                        }
                    }

                    let startWeekDate = new Date(requestDate.year, requestDate.month, requestDate.date); // handle get current week
                    let dayStartWeek = startWeekDate.getDay();
                    let diff = startWeekDate.getDate() - dayStartWeek + (dayStartWeek === 0 ? -6 : 1);
                    startWeekDate.setDate(diff);

                    for (const element of studySchduleArr) {
                        // convert date that form query from db to obj date in js

                        const date = new Date(element.date);
                        const dayOfWeekNumber = date.getDay();
                        element.date = date;
                        element.dayOfWeek = getDayOfWeekString(dayOfWeekNumber);
                    }
                    let weekStudySchedule = [];
                    for (let i = 0; i < 7; i++) {
                        let result = studySchduleArr.filter((element) => {
                            return (
                                element.date.getFullYear() === startWeekDate.getFullYear() &&
                                element.date.getMonth() === startWeekDate.getMonth() &&
                                element.date.getDate() === startWeekDate.getDate()
                            );
                        });

                        if (result.length > 0) {
                            weekStudySchedule = [...weekStudySchedule, ...result];
                        }
                        startWeekDate.setDate(startWeekDate.getDate() + 1);
                    }
                    for (const element of weekStudySchedule) {
                        // Lấy ngày, tháng, năm từ đối tượng Date
                        const day = String(element.date.getDate()).padStart(2, '0');
                        const month = String(element.date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                        const year = element.date.getFullYear();
                        const dayOfWeekNumber = element.date.getDay();

                        // Định dạng ngày theo DD-MM-YYYY
                        const formattedDate = `${day}-${month}-${year}`;
                        element.date = formattedDate;
                        element.dayOfWeek = getDayOfWeekString(dayOfWeekNumber);
                    }
                    if (weekStudySchedule.length > 0) {
                        resolve({
                            errCode: 0,
                            message: 'lấy học lịch học tuần này thành công',
                            data: weekStudySchedule,
                        });
                    } else {
                        resolve({ errCode: 2, message: 'tuần này không có tiết học nào', data: null });
                    }
                } else {
                    resolve({ errCode: 1, message: 'bạn chưa đăng ký học phần nào', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getStudySchedule StudentService',
                    details: error,
                });
            }
        });
    },
    registerLhp: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.quantityOfRegistered >= data.quantityOfstudents) {
                    resolve({ errCode: 1, message: 'đăng ký ko thành công số lượng sv đã đủ', data: null });
                } else {
                    let registeredLhpId = await db.StudentsOfLophocPhan.findAll({
                        where: { svId: data.svId },
                        attributes: ['lhpId'],
                    });
                    let resgisteredScheduleArr = [];

                    for (let i = 0; i < registeredLhpId.length; i++) {
                        let resgisteredSchedule = await db.StudySchedule.findAll({
                            where: {
                                lhpId: registeredLhpId[i].lhpId,
                            },
                        });
                        for (const element of resgisteredSchedule) {
                            resgisteredScheduleArr.push(element);
                        }
                    }
                    let prepareRegisterlhp = await db.StudySchedule.findAll({
                        where: {
                            lhpId: data.lhpId,
                        },
                    });
                    let duplicateSchedulesArr = [];
                    for (let index = 0; index < prepareRegisterlhp.length; index++) {
                        //Check to see if the class schedule overlaps
                        for (let index2 = 0; index2 < resgisteredScheduleArr.length; index2++) {
                            if (
                                prepareRegisterlhp[index].date == resgisteredScheduleArr[index2].date &&
                                prepareRegisterlhp[index].startTime == resgisteredScheduleArr[index2].startTime
                            ) {
                                let duplicateLhp1 = await db.Lophocphans.findOne({
                                    where: {
                                        lhpId: data.lhpId,
                                    },
                                    attributes: ['name'],
                                });
                                let duplicateLhp2 = await db.Lophocphans.findOne({
                                    where: {
                                        lhpId: resgisteredScheduleArr[index2].lhpId,
                                    },
                                    attributes: ['name'],
                                });

                                duplicateSchedulesArr.push({
                                    name1: duplicateLhp1.name,
                                    name2: duplicateLhp2.name,
                                    date: prepareRegisterlhp[index].date,
                                    time: prepareRegisterlhp[index].startTime,
                                });
                            }
                        }
                    }

                    if (duplicateSchedulesArr.length > 0) {
                        resolve({
                            errCode: 2,
                            message: 'Trùng lịch học ',
                            data: duplicateSchedulesArr,
                        });
                        return;
                    }
                    await db.StudentsOfLophocPhan.create({
                        svId: data.svId,
                        lhpId: data.lhpId,
                    });

                    resolve({ errCode: 0, message: 'đăng ký lớp học phần thành công', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at registerLhp StudentService',
                    details: error,
                });
                return;
            }
        });
    },
    removeRegisterLhp: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.state == 1) {
                    await db.StudentsOfLophocPhan.destroy({
                        where: { svId: data.svId, lhpId: data.lhpId },
                    });

                    resolve({ errCode: 0, message: 'Hủy thành công học phần', data: null });
                } else {
                    resolve({ errCode: 1, message: 'Học phần này đã Đóng không thể hủy', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at removeRegisterLhp StudentService',
                    details: error,
                });
            }
        });
    },
};
module.exports = studentStudentService;
