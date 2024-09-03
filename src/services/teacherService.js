const db = require('../models/index');
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
const getNameOfLhp = async (lhpId) => {
    let name = await db.Lophocphans.findOne({
        where: {
            lhpId: lhpId,
        },
        attributes: ['name'],
    });
    return name;
};
const getCreatedLhpIdArr = (teacherId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const registedLhpId = await db.Lophocphans.findAll({
                // những học phần đã đăng kys
                where: {
                    teacherId: teacherId,
                },
                attributes: ['lhpId'],
            });
            resolve(registedLhpId);
        } catch (error) {
            reject(error);
        }
    });
};
let timeTable = [
    { period: 1, startHour: '07', startMinute: '00', endHour: '07', endMinute: '45' },
    { period: 1, startHour: '07', startMinute: '00', endHour: '07', endMinute: '45' },
    { period: 2, startHour: '07', startMinute: '50', endHour: '08', endMinute: '35' },
    { period: 3, startHour: '08', startMinute: '40', endHour: '09', endMinute: '25' },
    { period: 4, startHour: '09', startMinute: '30', endHour: '10', endMinute: '15' },
    { period: 5, startHour: '10', startMinute: '20', endHour: '11', endMinute: '05' },
    { period: 6, startHour: '13', startMinute: '00', endHour: '13', endMinute: '45' },
    { period: 7, startHour: '13', startMinute: '50', endHour: '14', endMinute: '35' },
    { period: 8, startHour: '14', startMinute: '40', endHour: '15', endMinute: '25' },
    { period: 9, startHour: '15', startMinute: '30', endHour: '16', endMinute: '15' },
    { period: 10, startHour: '16', startMinute: '20', endHour: '17', endMinute: '05' },
    { period: 11, startHour: '17', startMinute: '10', endHour: '17', endMinute: '55' },
    { period: 12, startHour: '18', startMinute: '00', endHour: '18', endMinute: '45' },
    { period: 13, startHour: '18', startMinute: '50', endHour: '19', endMinute: '35' },
    { period: 14, startHour: '19', startMinute: '40', endHour: '20', endMinute: '25' },
];
const teacherService = {
    createLhp: (data) => {
        return new Promise(async (resolve, reject) => {
            const {
                name,
                state,
                quantityOfstudents,
                quantityoftinchi,
                startDateString,
                startTime,
                slTiet1buoi,
                daysOffWeek,
                ExamstartDateString,
                examStartTime,
                slTiet1buoiThi,
            } = data;
            if (
                name &&
                state &&
                quantityOfstudents &&
                quantityoftinchi &&
                startDateString &&
                startTime &&
                slTiet1buoi &&
                daysOffWeek &&
                ExamstartDateString &&
                examStartTime &&
                slTiet1buoiThi
            ) {
                try {
                    let price = quantityoftinchi * 300000; // 1 tin =300000
                    const lophocphan = await db.Lophocphans.create({
                        name: name,
                        teacherId: data.teacherId,
                        state: Number(state),
                        quantityOfstudents: quantityOfstudents,
                        quantityoftinchi: quantityoftinchi,
                        tuition: price,
                    });
                    let quantityOfTiet = Number(quantityoftinchi) * 10;
                    let quantityOfDay = quantityOfTiet / slTiet1buoi;
                    let startDateArr = startDateString.split('-'); // example : startDateString='2024-08-20'
                    let startYear = Number(startDateArr[0]);
                    let startMonth = Number(startDateArr[1]); //
                    let startDay = Number(startDateArr[2]);
                    let numberStart = Number(startTime);
                    let endTime = numberStart + Number(slTiet1buoi);
                    let startDate = new Date(startYear, startMonth, startDay);

                    let examStartNumber = Number(examStartTime);
                    let examEndTime = examStartNumber + Number(slTiet1buoiThi);
                    await db.examSchedule.create({
                        date: ExamstartDateString,
                        startTime: `${timeTable[examStartNumber].startHour}:${timeTable[examStartNumber].startMinute}`,
                        quantityOftiet: slTiet1buoiThi,
                        lhpId: lophocphan.lhpId,
                        endTime: `${timeTable[examEndTime].endHour}:${timeTable[examEndTime].endMinute}`,
                    });
                    if (Array.isArray(daysOffWeek)) {
                        let countStudyDay = 0;
                        while (countStudyDay < quantityOfDay) {
                            for (const element of daysOffWeek) {
                                if (startDate.getDay() === Number(element)) {
                                    await db.StudySchedule.create({
                                        date: `${startDate.getFullYear()}-${startDate.getMonth().toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
                                        startTime: `${timeTable[numberStart].startHour}:${timeTable[numberStart].startMinute}`,
                                        quantityOftiet: slTiet1buoi,
                                        lhpId: lophocphan.lhpId,
                                        endTime: `${timeTable[endTime].endHour}:${timeTable[endTime].endMinute}`,
                                    });
                                    countStudyDay++;
                                }
                            }
                            startDate.setDate(startDate.getDate() + 1);
                        }
                    } else {
                        let countStudyDay = 0;
                        while (countStudyDay < quantityOfDay) {
                            if (startDate.getDay() === Number(daysOffWeek)) {
                                await db.StudySchedule.create({
                                    date: `${startDate.getFullYear()}-${startDate.getMonth().toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
                                    startTime: `${timeTable[numberStart].startHour}:${timeTable[numberStart].startMinute}`,
                                    quantityOftiet: slTiet1buoi,
                                    lhpId: lophocphan.lhpId,
                                    endTime: `${timeTable[endTime].endHour}:${timeTable[endTime].endMinute}`,
                                });
                            }

                            startDate.setDate(startDate.getDate() + 1);
                            countStudyDay++;
                        }
                    }

                    resolve({ errCode: 0, message: 'Tạo  thành công lớp học phần', data: lophocphan });
                } catch (error) {
                    reject({
                        message: 'error at createLhp teacherService',
                        details: error,
                    });
                }
            } else {
                resolve({ errCode: 1, message: 'chưa nhập dữ liệu', data: null });
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
                    resolve({ errCode: 0, message: 'Lấy danh sách lớp học phần thành công', data: lophocphans });
                } else {
                    resolve({ errCode: 1, message: 'Chưa tạo lớp nào', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getListLhp teacherService',
                    details: error,
                });
            }
        });
    },
    getLhp: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.lhpId && data.teacherId) {
                    const lophocphan = await db.Lophocphans.findOne({
                        where: {
                            teacherId: data.teacherId,
                            lhpId: data.lhpId,
                        },
                    });
                    if (lophocphan) {
                        resolve({ errCode: 0, message: 'Lấy lớp học phần thành công', data: lophocphan });
                    } else {
                        resolve({ errCode: 2, message: 'Lấy lớp học phần thất bại', data: null });
                    }
                } else {
                    resolve({ errCode: 1, message: 'lhpId hoặc teacherID không tồn tại', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at createLhp teacherService',
                    details: error,
                });
            }
        });
    },
    getStudentLhpList: (lhpId) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (lhpId) {
                    const studentIdOfLhplist = await db.StudentsOfLophocPhan.findAll({
                        where: {
                            lhpId: lhpId,
                        },
                        attributes: ['svId', 'diemchuyencan', 'diemgiuaky', 'diemthi'],
                    });
                    if (studentIdOfLhplist.length > 0) {
                        const studentOfLhpList = [];
                        for (const element of studentIdOfLhplist) {
                            const student = await db.Students.findOne({
                                where: {
                                    svId: element.svId,
                                },
                                attributes: ['LastName', 'FirstName', 'svId', 'makhoa', 'classCode'],
                            });
                            student.diemchuyencan = element.diemchuyencan;
                            student.diemgiuaky = element.diemgiuaky;
                            student.diemthi = element.diemthi;
                            studentOfLhpList.push(student);
                        }

                        resolve({
                            errCode: 0,
                            message: 'get succsessfully student of this lhp list',
                            data: studentOfLhpList,
                        });
                    } else {
                        resolve({
                            errCode: 2,
                            message: 'there isnt any student of this lhp',
                            data: studentIdOfLhplist,
                        });
                    }
                } else {
                    resolve({ errCode: 1, message: 'thiếu lhpid', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getStudnentLhpList teacherService',
                    details: error,
                });
            }
        });
    },
    updateLhp: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, state, quantityoftinchi, quantityOfstudents, lhpId } = data;

                if (name && (state == '0' || state == '1') && quantityoftinchi && quantityOfstudents && lhpId) {
                    await db.Lophocphans.update(
                        {
                            name: name,
                            state: state,
                            quantityoftinchi: quantityoftinchi,
                            quantityOfstudents: quantityOfstudents,
                        },
                        {
                            where: {
                                lhpId: lhpId,
                            },
                        },
                    );
                    resolve({ errCode: 0, message: 'update thành công', data: null });
                } else {
                    resolve({ errCode: 1, message: 'dữ liệu nhập vào bị thiếu', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at createLhp teacherService',
                    details: error,
                });
            }
        });
    },
    removeLhp: (lhpId) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (lhpId) {
                    await db.Lophocphans.destroy({
                        where: { lhpId: lhpId },
                    });
                    await db.StudySchedule.destroy({
                        where: { lhpId: lhpId },
                    });
                    await db.examSchedule.destroy({
                        where: { lhpId: lhpId },
                    });
                    resolve({ errCode: 0, message: 'Xóa thành công học phần', data: null });
                } else {
                    resolve({ errCode: 1, message: 'Không có lhpId', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at createLhp teacherService',
                    details: error,
                });
            }
        });
    },
    grading: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // check if teacher  created this lhp

                if (!data.lhpId || !data.teacherId || !data.svId) {
                    resolve({ errCode: 1, message: 'lhpId or teacherId or svId arent exist! ', data: null });
                    return;
                }
                const correctTeacher = await db.Lophocphans.findOne({
                    where: {
                        lhpId: data.lhpId,
                    },
                    attributes: ['teacherId'],
                });
                if (data.teacherId == correctTeacher.teacherId) {
                    let diemchuyencan = Number(data.diemchuyencan);
                    let diemgiuaky = Number(data.diemgiuaky);
                    let diemthi = Number(data.diemthi);
                    if (diemchuyencan && diemgiuaky && diemthi) {
                        // check if it must have 3 part before updating diemtongket
                        let diemtongket = diemchuyencan * 0.15 + diemgiuaky * 0.25 + diemthi * 0.6;
                        await db.StudentsOfLophocPhan.update(
                            {
                                diemchuyencan: diemchuyencan,
                                diemgiuaky: diemgiuaky,
                                diemthi: diemthi,
                                diemtongket: diemtongket,
                            },
                            {
                                where: {
                                    svId: data.svId,
                                },
                            },
                        );
                    } else {
                        await db.StudentsOfLophocPhan.update(
                            {
                                diemchuyencan: diemchuyencan,
                                diemgiuaky: diemgiuaky,
                                diemthi: diemthi,
                            },
                            {
                                where: {
                                    svId: data.svId,
                                },
                            },
                        );
                    }

                    resolve({ errCode: 0, message: 'grading succsessfully', data: null });
                } else {
                    resolve({ errCode: 2, message: 'you are not allowed to do this', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at grading teacherService',
                    details: error,
                });
            }
        });
    },
    getTeachShedule: (teacherId, dateRequest) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!teacherId || !dateRequest.year || !dateRequest.month || !dateRequest.date) {
                    resolve({
                        errCode: 3,
                        message: 'thiếu dữ liệu kèm theo',
                        data: null,
                    });
                    return;
                }
                const createdLhpId = await db.Lophocphans.findAll({
                    // những học phần đã đăng kys
                    where: {
                        teacherId: teacherId,
                    },
                    attributes: ['lhpId', 'name'],
                });

                if (createdLhpId) {
                    let teachSchduleArr = [];
                    for (const lhpIdAndName of createdLhpId) {
                        let ScheduleOfLhp = await db.StudySchedule.findAll({
                            where: {
                                lhpId: lhpIdAndName.lhpId,
                            },
                        });

                        for (const element of ScheduleOfLhp) {
                            element.name = lhpIdAndName.name;

                            teachSchduleArr.push(element);
                        }
                    }

                    let startWeekDate = new Date(dateRequest.year, dateRequest.month, dateRequest.date); // handle get current week
                    let dayStartWeek = startWeekDate.getDay();
                    let diff = startWeekDate.getDate() - dayStartWeek + (dayStartWeek === 0 ? -6 : 1);
                    startWeekDate.setDate(diff);

                    for (const element of teachSchduleArr) {
                        // convert date that form query from db to obj date in js

                        const date = new Date(element.date);
                        const dayOfWeekNumber = date.getDay();
                        element.date = date;
                        element.dayOfWeek = getDayOfWeekString(dayOfWeekNumber);
                    }
                    let weekTeachSchedule = [];
                    for (let i = 0; i < 7; i++) {
                        let result = teachSchduleArr.filter((element) => {
                            return (
                                element.date.getFullYear() === startWeekDate.getFullYear() &&
                                element.date.getMonth() === startWeekDate.getMonth() &&
                                element.date.getDate() === startWeekDate.getDate()
                            );
                        });

                        if (result.length > 0) {
                            weekTeachSchedule = [...weekTeachSchedule, ...result];
                        }
                        startWeekDate.setDate(startWeekDate.getDate() + 1);
                    }
                    for (const element of weekTeachSchedule) {
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
                    if (weekTeachSchedule.length > 0) {
                        resolve({
                            errCode: 0,
                            message: 'lấy học lịch dạy tuần này thành công',
                            data: weekTeachSchedule,
                        });
                    } else {
                        resolve({ errCode: 2, message: 'tuần này không có tiết học nào', data: null });
                    }
                } else {
                    resolve({ errCode: 1, message: 'bạn chưa đăng ký học phần nào', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getTeacherSchedule teacherService',
                    details: error,
                });
            }
        });
    },
    getExamWatchingSchedule: (teacherId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const createdLhpIdArr = await getCreatedLhpIdArr(teacherId);
                const examScheduleArr = [];
                for (const element of createdLhpIdArr) {
                    let examSchedule = await db.examSchedule.findOne({
                        where: {
                            lhpId: element.lhpId,
                        },
                    });
                    examScheduleArr.push(examSchedule);
                }
                if (examScheduleArr.length > 0) {
                    for (const element of examScheduleArr) {
                        let nameOfLhp = await getNameOfLhp(element.lhpId);
                        element.nameOfLhp = nameOfLhp.name;
                    }
                    for (const element of examScheduleArr) {
                        // convert date that form query from db to obj date in js

                        const date = new Date(element.date);

                        // Lấy ngày, tháng, năm từ đối tượng Date
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                        const year = date.getFullYear();

                        // Định dạng ngày theo DD-MM-YYYY
                        const formattedDate = `${day}-${month}-${year}`;
                        element.date = formattedDate;
                    }
                    resolve({ errCode: 0, message: 'get exam watching schedule sucssessfully', data: examScheduleArr });
                } else {
                    resolve({ errCode: 1, message: 'you didnt create any lhp ', data: null });
                }
            } catch (error) {
                reject({
                    message: 'error at getExamWatchingSchedule teacherService',
                    details: error,
                });
            }
        });
    },
};
module.exports = teacherService;
