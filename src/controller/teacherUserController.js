const teacherService = require('../services/teacherService');

const teacherController = {
    createlhp: async (req, res) => {
        try {
            req.body.teacherId = req.session.userData.teacherId;

            let response = await teacherService.createLhp(req.body);

            if (!response.errCode) {
                return res.send(`
                <script>
                    alert('${response.message} ${response.data.name}');
                    window.location.href = '/teacher/create-lophocphan-form';
                </script>
            `);
            } else {
                return res.send(`
                <script>
                    alert('${response.message} ');
                    window.location.href = '/teacher/create-lophocphan-form';
                </script>
            `);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getCreateLhpForm: (req, res) => {
        return res.render('featured_form/teacher/create_lhp', { userData: req.session.userData });
    },
    getListLhp: async (req, res) => {
        try {
            const teacherId = req.session.userData.teacherId;
            const response = await teacherService.getListLhp(teacherId);
            if (req.query.grading) {
                return res.render('featured_form/teacher/list_lhp', {
                    userData: req.session.userData,
                    lhpData: response,
                    grading: 'ok',
                });
            } else if (req.query.edit) {
                return res.render('featured_form/teacher/list_lhp', {
                    userData: req.session.userData,
                    lhpData: response,
                    edit: 'ok',
                });
            } else {
                return res.render('featured_form/teacher/list_lhp', {
                    userData: req.session.userData,
                    lhpData: response,
                });
            }
            // console.log(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getEditLhpForm: async (req, res) => {
        try {
            let data = req.query;
            data.teacherId = req.session.userData.teacherId;

            let response = await teacherService.getLhp(data);
            res.render('featured_form/teacher/edit_lhp_form.hbs', {
                userData: req.session.userData,
                lhp: response,
            });
        } catch (error) {
            console.log(error);

            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getStudentListOfLhp: async (req, res) => {
        let response = await teacherService.getStudentLhpList(req.query.lhpId);

        return res.render('featured_form/teacher/student_list_of_lhp.hbs', {
            userData: req.session.userData,
            studentList: response,
            lhpName: req.query.name,
            lhpId: req.query.lhpId,
        });
    },
    grading: async (req, res) => {
        try {
            let data = req.body;
            data.svId = req.query.svId;
            data.lhpId = req.query.lhpId;
            data.teacherId = req.session.userData.teacherId;

            let response = await teacherService.grading(data);

            return res.send(`
                <script>
                    alert('${response.message}');
                    window.location.href = '/teacher/get-student-lhp-list?lhpId=${data.lhpId}&name=${req.query.name}';
                </script>
            `);
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    updateLhp: async (req, res) => {
        try {
            let data = req.body;
            data.lhpId = req.query.lhpId;
            let response = await teacherService.updateLhp(data);

            return res.send(`
                <script>
                    alert('${response.message}');
                    window.location.href = '/teacher/get-edit-lhp-form?lhpId=${data.lhpId}';
                </script>
            `);
        } catch (error) {
            console.log(error);
            res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    removeLhp: async (req, res) => {
        try {
            let lhpId = req.query.lhpId;
            let response = await teacherService.removeLhp(lhpId);
            res.send(`
            <script>
                alert('${response.message}');
                window.location.href = '/teacher/list_lhp?edit=1';
            </script>
        `);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },
    getWeekTeachingSchedule: async (req, res) => {
        try {
            let dateRequest = req.query;
            let currentDay = new Date(Number(dateRequest.year), Number(dateRequest.month), Number(dateRequest.date));
            let dayOfWeek = currentDay.getDay(); // Ngày trong tuần, 0 là Chủ Nhật, 1 là Thứ Hai, v.v.
            let daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Tính số ngày đến thứ Hai
            let thisMonday = new Date(currentDay);
            thisMonday.setDate(currentDay.getDate() - daysToMonday);
            // find sunday
            let thisSunday = new Date(thisMonday);
            thisSunday.setDate(thisSunday.getDate() + 6);
            // 3. Tính ngày thứ Hai của tuần trước
            let lastMonday = new Date(thisMonday);
            lastMonday.setDate(thisMonday.getDate() - 7); // Trừ đi 7 ngày để lấy tuần trước

            // 4. last monday
            let nextMonday = new Date(thisMonday);
            nextMonday.setDate(thisMonday.getDate() + 7); // Cộng thêm 7 ngày để lấy tuần sau
            let lastMondayUsedForReq = {
                year: lastMonday.getFullYear(),
                month: lastMonday.getMonth(),
                date: lastMonday.getDate(),
            };
            // next monday
            let nextMondayUsedForReq = {
                year: nextMonday.getFullYear(),
                month: nextMonday.getMonth(),
                date: nextMonday.getDate(),
            };
            // this monday as string and this sunday as string
            let thisMondayString = `${thisMonday.getDate()}-${thisMonday.getMonth() + 1}-${thisMonday.getFullYear()}`;
            let thisSundayString = `${thisSunday.getDate()}-${thisSunday.getMonth() + 1}-${thisSunday.getFullYear()}`;
            let response = await teacherService.getTeachShedule(req.session.userData.teacherId, dateRequest);
            return res.render('featured_form/student/studySchedule.hbs', {
                userData: req.session.userData,
                teachSchedule: response,
                lastMonday: lastMondayUsedForReq,
                nextMonday: nextMondayUsedForReq,
                thisMondayString: thisMondayString,
                thisSundayString: thisSundayString,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },

    getExamWatchingSchedule: async (req, res) => {
        try {
            let response = await teacherService.getExamWatchingSchedule(req.session.userData.teacherId);
            return res.render('featured_form/student/exam_schedule.hbs', {
                userData: req.session.userData,
                examSchedule: response,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },
};

module.exports = teacherController;
