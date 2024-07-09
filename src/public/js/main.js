let us_links = document.querySelector('.us-links');
let userCaretDown = document.querySelector('.user-account-name-caret-down');
userCaretDown.onclick = () => {
    if (us_links.style.display == 'none') {
        us_links.style.display = 'block';
    } else {
        us_links.style.display = 'none';
    }
};
