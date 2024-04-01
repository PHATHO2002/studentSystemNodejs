let testController = (req, res) => {
    console.log(req.file);
    return res.send('ok');
};
module.exports = testController;
