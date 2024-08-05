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

            return res.render('featured_form/teacher/list_lhp', {
                userData: req.session.userData,
                lhpData: response,
            });
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
                window.location.href = '/teacher/list_lhp';
            </script>
        `);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Lỗi Server Nội bộ');
        }
    },
};

module.exports = teacherController;
