// variabel login statis
const VALID_USERNAME = "aliya";
const VALID_PASSWORD = "admin123";

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    // cek statis
    if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
        // simpan status login
        localStorage.setItem("isLoggedIn", "true"); //set item menulis di local storage

        window.location.href = "admin.html";  // redirect
        return false;
    } else {
        alert("Username atau password salah!");
    }
    
}