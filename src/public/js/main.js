let registerModal = document.querySelector('.register_modal_js');
let registerButton = document.getElementById('nav_login');
let registerClose = document.getElementById('register_modal_close_js');
// hanlde logic modal register
registerButton.onclick = (e) => {
    e.preventDefault();
    registerModal.style.display = 'flex';
};
registerClose.onclick = (e) => {
    registerModal.style.display = 'none';
};

if (registerModal) {
    registerModal.onclick = (e) => {
        e.target.style.display = 'none';
    };
}

function historyBack() {
    window.history.back();
}
function stopPropagation(e) {
    e.stopPropagation();
}
