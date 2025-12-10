if (localStorage.getItem("isLoggedIn") !== "true") { //membaca true apa ga
    window.location.href = "login.html";
}
function logout() {
// hapus status login
    localStorage.removeItem("isLoggedIn"); 

    // redirect ke halaman login
    window.location.href = "login.html";
}