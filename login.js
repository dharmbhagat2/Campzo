document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("loggedUser", email);
        localStorage.setItem("loggedUserName", "Admin");

        alert("Admin Login Successful");

        window.location.href = "admin.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("loggedUser", user.email);
        localStorage.setItem("loggedUserName", user.name);

        alert("Login Successful");

        window.location.href = "index.html";
    } else {
        alert("Invalid Email or Password");
    }
});