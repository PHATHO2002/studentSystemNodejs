const db = require('../models/index');
const teacherService = {
    createLhp: (data) => {
        return new Promise(async (resolve, reject) => {
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
            ];
            const {
                name,
                state,
                quantityOfstudents,
                quantityoftinchi,
                startDateString,
                timeStart,
                slTiet1buoi,
                daysOffWeek,
            } = data;
            if (
                name &&
                state &&
                quantityOfstudents &&
                quantityoftinchi &&
                startDateString &&
                timeStart &&
                slTiet1buoi &&
                daysOffWeek
            ) {
                try {
                    const lophocphan = await db.Lophocphans.create({
                        name: name,
                        teacherId: data.teacherId,
                        state: Number(state),
                        quantityOfstudents: quantityOfstudents,
                        quantityoftinchi: quantityoftinchi,
                    });
                    let quantityOfTiet = Number(quantityoftinchi) * 10;
                    let quantityOfDay = quantityOfTiet / slTiet1buoi;
                    let endTime = Number(timeStart) + Number(slTiet1buoi);
                    let startDateArr = startDateString.split('-');
                    let startYear = Number(startDateArr[0]);
                    let startMonth = Number(startDateArr[1]);
                    let startDay = Number(startDateArr[2]);
                    let numberStart = Number(timeStart);

                    let startDate = new Date(startYear, startMonth, startDay);
                    console.log(daysOffWeek);
                    if (Array.isArray(daysOffWeek)) {
                        let countStudyDay = 0;
                        while (countStudyDay < quantityOfDay) {
                            for (const element of daysOffWeek) {
                                if (startDate.getDay() === Number(element)) {
                                    await db.StudySchedule.create({
                                        date: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`,
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
                                    startTime: `${startDate.getFullYear()}-${startDate.getMonth + 1}-${startDate.getDate()} ${timeTable[numberStart].startHour}:${timeTable[numberStart].startMinute}:00`,
                                    endTime: `${timeTable[endTime].endHour}:${timeTable[endTime].endMinute}`,
                                    quantityOftiet: slTiet1buoi,
                                    lhpId: lophocphan.lhpId,
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
};
module.exports = teacherService;
