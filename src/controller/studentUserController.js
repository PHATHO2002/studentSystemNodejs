const { response } = require('express');
const studentService = require('../services/studentService');

const StudenttController = {
    getListLhpOpen: async (req, res) => {
        try {
            const response = await studentService.getListLhp_open(req.session.userData.svId);

            return res.render('featured_form/student/listdslhp_open.hbs', {
                userData: req.session.userData,
                listlhpopen: response,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getListLhpregisted: async (req, res) => {
        try {
            let response = await studentService.getListLhpregisted(req.session.userData.svId);
            return res.render('featured_form/student/listlhpRegisted.hbs', {
                userData: req.session.userData,
                listLhpRegister: response,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getScheduleOfLhp: async (req, res) => {
        try {
            let lhpId = req.query.lhpId;
            let response = await studentService.getScheduleOfLhp(lhpId);
            return res.render('featured_form/scheduleOfLhp.hbs', {
                userData: req.session.userData,
                scheduleOfLhp: response.data,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getStudySchedule: async (req, res) => {
        try {
            let requestDate = req.query;
            let currentDay = new Date(Number(requestDate.year), Number(requestDate.month), Number(requestDate.date));
            let dayOfWeek = currentDay.getDay(); // Ngày trong tuần, 0 là Chủ Nhật, 1 là Thứ Hai, v.v.
            let daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Tính số ngày đến thứ Hai
            let thisMonday = new Date(currentDay);
            thisMonday.setDate(currentDay.getDate() - daysToMonday);
            // 3. Tính ngày thứ Hai của tuần trước
            let lastMonday = new Date(thisMonday);
            lastMonday.setDate(thisMonday.getDate() - 7); // Trừ đi 7 ngày để lấy tuần trước

            // 4. Tính ngày thứ Hai của tuần sau
            let nextMonday = new Date(thisMonday);
            nextMonday.setDate(thisMonday.getDate() + 7); // Cộng thêm 7 ngày để lấy tuần sau
            let lastMondayUseForReq = {
                year: lastMonday.getFullYear(),
                month: lastMonday.getMonth(),
                date: lastMonday.getDate(),
            };
            console.log(lastMondayUseForReq);
            let response = await studentService.getStudySchedule(req.session.userData.svId, requestDate);
            return res.render('featured_form/student/studySchedule.hbs', {
                userData: req.session.userData,
                studySchedule: response,
                lastMonday: lastMondayUseForReq,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    registerLhp: async (req, res) => {
        try {
            let data = req.query;
            data.svId = req.session.userData.svId;
            let response = await studentService.registerLhp(data);
            if (response.errCode == 2) {
                let alertString = '';
                for (const element of response.data) {
                    alertString += ` ${response.message} giữa  ${element.name1} và ${element.name2} vào ngày ${element.date} lúc ${element.time} ;`;
                }
                res.send(`
                    <script>
                        alert('${alertString}');
                        window.location.href = '/student/getListLhp-open';
                    </script>
                `);
            } else {
                res.send(`
                <script>
                    alert('${response.message}');
                    window.location.href = '/student/getListLhp-open';
                </script>
            `);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    removeRegistedLhp: async (req, res) => {
        try {
            let data = req.query;
            data.svId = req.session.userData.svId;
            let response = await studentService.removeRegisterLhp(data);
            res.send(`
            <script>
                alert('${response.message}');
                window.location.href = '/student/getListLhp-registed';
            </script>
        `);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },
};

module.exports = StudenttController;
