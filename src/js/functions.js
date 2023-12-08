const toastElList = [].slice.call(document.querySelectorAll('.toast'))
const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
});


export default {
    toastElList(msg = '') {
        document.getElementById('messageText').innerHTML = msg
        toastList.forEach(toast => toast.show());
        setTimeout(() => {
            document.getElementById('messageText').innerHTML  = ''
        }, 10000);
    }
}