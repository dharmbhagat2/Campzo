function showToast(message, type = "success") {

    let container = document.getElementById("toastContainer");

    if (!container) {

        console.error("Toast container missing ❌");

        return;

    }

    let toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}