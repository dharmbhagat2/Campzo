window.onload = function () {
    document.getElementById("addBtn").addEventListener("click", addEvent);
    loadEvents();
    togglePriceInput(); // 🔥 ensure correct UI state on load
};

// ==========================================
// 🔥 ADD EVENT WITH IMAGE + CUSTOM PRICE
// ==========================================
async function addEvent() {

    let title = document.getElementById("eventTitle").value;
    let description = document.getElementById("eventDescription").value;
    let date = document.getElementById("eventDate").value;
    let time = document.getElementById("eventTime").value;
    let mobile = document.getElementById("eventMobile").value;
    let email = document.getElementById("eventEmail").value;
    let imageFile = document.getElementById("eventImage").files[0];

    // 🔥 PRICE LOGIC (UPDATED)
    let priceType = document.getElementById("eventPriceType").value;
    let price;

    if (priceType === "free") {
        price = "Free";
    } else {
        let customPrice = document.getElementById("customPrice").value;

        if (!customPrice) {
            alert("Please enter custom price ⚠️");
            return;
        }

        price = "₹" + customPrice;
    }

    if (!title || !date) {
        alert("Title & Date required ⚠️");
        return;
    }

    let formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("price", price);
    formData.append("mobile", mobile);
    formData.append("email", email);

    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        await fetch("http://localhost:3000/events", {
            method: "POST",
            body: formData
        });

showToast("Event Added Successfully ✅");
        clearForm();
        loadEvents();

    } catch (err) {
        console.error(err);
        alert("Error ❌");
    }
}

// ==========================================
// 🔥 LOAD EVENTS
// ==========================================
async function loadEvents() {
    const res = await fetch("http://localhost:3000/events");
    const events = await res.json();

    let table = document.getElementById("eventTable");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Price</th>
            <th>Action</th>
        </tr>
    `;

    if (events.length === 0) {
        table.innerHTML += `<tr><td colspan="4">No Events Found</td></tr>`;
        return;
    }

    events.forEach(event => {
        table.innerHTML += `
            <tr>
                <td>${event.title}</td>
                <td>${event.date}</td>
                <td>${event.price}</td>
                <td>
                    <button onclick="deleteEvent(${event.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// 🔥 DELETE EVENT
// ==========================================
async function deleteEvent(id) {
    await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE"
    });

    loadEvents();
}

// ==========================================
// 🔥 IMAGE PREVIEW + SHOW/HIDE
// ==========================================
const imageInput = document.getElementById("eventImage");
const preview = document.getElementById("imagePreview");
const previewContainer = document.getElementById("previewContainer");
const changeBtn = document.getElementById("changeImageBtn");

if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;

                previewContainer.style.display = "block";

                preview.classList.add("bounce");
                setTimeout(() => preview.classList.remove("bounce"), 400);
            };

            reader.readAsDataURL(file);
        }
    });
}

if (changeBtn) {
    changeBtn.addEventListener("click", function () {
        imageInput.click();
    });
}

// ==========================================
// 🔥 TOGGLE PRICE INPUT (FREE / CUSTOM)
// ==========================================
function togglePriceInput() {
    const type = document.getElementById("eventPriceType").value;
    const box = document.getElementById("customPriceBox");

    if (type === "custom") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

// ==========================================
// 🔥 CLEAR FORM AFTER SUBMIT
// ==========================================
function clearForm() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDescription").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";

    document.getElementById("eventPriceType").value = "free";
    document.getElementById("customPrice").value = "";
    document.getElementById("customPriceBox").style.display = "none";

    document.getElementById("eventMobile").value = "";
    document.getElementById("eventEmail").value = "";
    document.getElementById("eventImage").value = "";

    if (preview) {
        preview.src = "";
        previewContainer.style.display = "none";
    }
}
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}