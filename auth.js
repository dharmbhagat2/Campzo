let pendingUser = null;
async function login() {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // Admin Login
    if (email === "admin@gmail.com" && password === "admin123") {

        localStorage.setItem("loggedUser", email);
        localStorage.setItem("loggedUserName", "Admin");

        window.location.href = "admin.html";
        return;
    }

    try {

        const response = await fetch("https://campzo.onrender.com/login-user", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("loggedUser", data.user.email);
            localStorage.setItem("loggedUserName", data.user.name);

            showToast("Login Successful", "success");

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1200);

        } else {

            showToast(data.message, "error");

        }

    }
    catch (err) {

        console.log(err);

        showToast("Server Error", "error");

    }

}
async function register() {

    const registerBtn = document.getElementById("registerBtn");

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!name || !email || !mobile || !password) {

        showToast("Please fill all fields", "error");
        return;

    }

    // Prevent multiple clicks
    if (registerBtn.disabled) {
        return;
    }

    pendingUser = {
        name,
        email,
        mobile,
        password
    };

    // Disable button immediately
    registerBtn.disabled = true;
    registerBtn.innerHTML = "Sending OTP...";

    try {

        const response = await fetch(
            "https://campzo.onrender.com/send-otp",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    name
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            showToast("OTP Sent Successfully", "success");

            document.getElementById("otpModal").style.display = "flex";

        } else {

            showToast(data.message, "error");

        }

    } catch (err) {

        console.log(err);

        showToast("Unable to send OTP", "error");

    } finally {

        // Enable again after request finishes
        registerBtn.disabled = false;
        registerBtn.innerHTML = "Register";

    }

}
async function verifyOTP() {

    // Get OTP from 6 input boxes
    const otp = [...document.querySelectorAll(".otp")]
        .map(input => input.value)
        .join("");

    if (otp.length !== 6) {
        showToast("Please enter 6-digit OTP", "error");
        return;
    }

    try {

        // Verify OTP
        const verifyResponse = await fetch("https://campzo.onrender.com/verify-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: pendingUser.email,
                otp: otp

            })

        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {

            showToast(verifyData.message, "error");
            return;

        }

        // Save User in MySQL
        const registerResponse = await fetch("https://campzo.onrender.com/register-user", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pendingUser)

        });

        const registerData = await registerResponse.json();

        if (registerData.success) {

            showToast("Registration Successful", "success");

            document.getElementById("otpModal").style.display = "none";

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

        } else {

            showToast(registerData.message, "error");

        }

    }
    catch (err) {

        console.log(err);

        showToast("Server Error", "error");

    }

}
// OTP INPUT AUTO NEXT / PREVIOUS

const otpInputs = document.querySelectorAll(".otp");

otpInputs.forEach((input, index) => {

    input.addEventListener("input", (e) => {

        let value = e.target.value;

        // Only allow numbers
        value = value.replace(/[^0-9]/g, "");
        e.target.value = value;

        if (value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

    });

    input.addEventListener("keydown", (e) => {

        if (
            e.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {
            otpInputs[index - 1].focus();
        }

    });

});

otpInputs[0].addEventListener("paste", (e) => {

    e.preventDefault();

    let otp = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim();

    otp = otp.replace(/\D/g, "");

    otpInputs.forEach((input, i) => {

        input.value = otp[i] || "";

    });

    const last =
        Math.min(otp.length, otpInputs.length) - 1;

    if (last >= 0) {
        otpInputs[last].focus();
    }

});
function closeOTP(){

    document.getElementById("otpModal").style.display = "none";

    // Clear all OTP boxes
    document.querySelectorAll(".otp").forEach(box=>{
        box.value="";
    });

    // Focus first box next time
    document.querySelector(".otp").focus();

}
window.onclick = function(event){

    const modal = document.getElementById("otpModal");

    if(event.target === modal){
        closeOTP();
    }

}