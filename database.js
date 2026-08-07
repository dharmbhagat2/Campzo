if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([
        { email: "admin@college.com", password: "admin123", role: "admin" }
    ]));
}