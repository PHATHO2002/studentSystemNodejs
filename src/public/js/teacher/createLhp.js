let startDate = new Date();
console.log(startDate);
// Tạo endDate là 30 ngày sau
let endDate = new Date();
endDate.setDate(startDate.getDate() + 30);

// Tìm combobox
let dateDropdown = document.getElementById('startDateString');

// Vòng lặp qua từng ngày trong khoảng thời gian
for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    let day = d.getDate();
    let month = d.getMonth() + 1; // getMonth() trả về giá trị từ 0 (tháng 1) đến 11 (tháng 12)
    let monthIndex = d.getMonth();
    let year = d.getFullYear();
    month = month.toString();
    day = day.toString();
    let paddedMonth = month.padStart(2, '0');
    let paddedDay = day.padStart(2, '0');

    let option = document.createElement('option');
    option.value = `${year}-${monthIndex}-${paddedDay}`;
    option.text = `${paddedDay}/${paddedMonth}/${year}`;
    dateDropdown.add(option);
}
