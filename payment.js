const paymentEvent = JSON.parse(localStorage.getItem("paymentEvent"));

// ==========================================
// 🔥 EVENT DETAILS
// ==========================================
document.getElementById("eventName").innerText =
    paymentEvent.title;

// 🔥 CLEAN PRICE
let cleanPrice =
    paymentEvent.price.toString().replace("₹", "").trim();

document.getElementById("eventPrice").innerText =
    cleanPrice;

// ==========================================
// 🔥 DEFAULT METHOD
// ==========================================
let selectedMethod = "upi";

// 🔥 GENERATE QR ON PAGE LOAD
generateQRCode();

// ==========================================
// 🔥 SELECT PAYMENT METHOD
// ==========================================
function selectMethod(method) {

    selectedMethod = method;

    const upiSection =
        document.getElementById("upiSection");

    const cardSection =
        document.getElementById("cardSection");

    if (method === "upi") {

        upiSection.classList.remove("hidden");
        cardSection.classList.add("hidden");

        generateQRCode();

    } else {

        cardSection.classList.remove("hidden");
        upiSection.classList.add("hidden");
    }
}

// ==========================================
// 🔥 GENERATE QR CODE
// ==========================================
function generateQRCode() {

    // 🔥 REMOVE ₹
    const amount =
        cleanPrice.replace("₹", "").trim();

    // 🔥 YOUR REAL UPI ID
    const upiId = "dharmbhagat869@oksbi";

    // 🔥 COLLEGE / RECEIVER NAME
    const receiverName = "CEMW College";

    // 🔥 EVENT NAME IN NOTE
    const eventNote = paymentEvent.title;

    // 🔥 CREATE UPI LINK
    const upiLink =
        `upi://pay?pa=${upiId}` +
        `&pn=${encodeURIComponent(receiverName)}` +
        `&tn=${encodeURIComponent(eventNote)}` +
        `&am=${amount}` +
        `&cu=INR`;

    // 🔥 QR GENERATOR
    const qrURL =
        `https://quickchart.io/qr?text=${encodeURIComponent(upiLink)}&size=250`;

    // 🔥 SHOW QR
    document.getElementById("upiQR").src = qrURL;
}

// ==========================================
// 🔥 PAY NOW
// ==========================================
async function payNow() {

    try {

        const amount =
            cleanPrice.replace("₹", "").trim();

        // 🔥 CREATE ORDER
        const res = await fetch(
            "https://campzo.onrender.com/create-order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: amount
                })
            }
        );

        const order = await res.json();

        // 🔥 RAZORPAY OPTIONS
        const options = {

            // 🔥 YOUR TEST KEY
            key: "rzp_test_Sm1kCm9tLZsKBT",

            amount: order.amount,

            currency: "INR",

            name: "CEMW College",

            description: paymentEvent.title,

            order_id: order.id,

            image:
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

            // ==========================================
            // 🔥 FORCE ONLY UPI
            // ==========================================
           method: {
    upi: true
},

           

            // ==========================================
            // 🔥 PREFILL
            // ==========================================
            prefill: {

                name:
                    localStorage.getItem("loggedUserName"),

                email:
                    localStorage.getItem("loggedUser"),

                contact:
                    "6351136211"
            },

            // ==========================================
            // 🔥 PAYMENT SUCCESS
            // ==========================================
            handler: async function (response) {

                console.log(
                    "PAYMENT SUCCESS:",
                    response
                );

                // 🔥 SAVE REGISTRATION
                await fetch(
                    "https://campzo.onrender.com/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                localStorage.getItem("loggedUserName"),

                            email:
                                localStorage.getItem("loggedUser"),

                            eventId:
                                paymentEvent.id,

                            title:
                                paymentEvent.title,

                            date:
                                paymentEvent.date,

                            time:
                                paymentEvent.time,

                            paymentStatus:
                                "Success",

                            amount:
                                paymentEvent.price
                        })
                    }
                );

                // 🔥 SUCCESS POPUP
                const popup =
                    document.getElementById("successPopup");

                popup.style.display = "flex";

                setTimeout(() => {

                    popup.style.display = "none";

                    window.location.href =
                        "events.html";

                }, 2500);
            },

            // ==========================================
            // 🔥 THEME
            // ==========================================
            theme: {
                color: "#3399cc"
            }
        };

        // 🔥 OPEN RAZORPAY
        const razorpay =
            new Razorpay(options);

        razorpay.open();

    } catch (err) {

        console.log(err);

        alert("Payment Failed ❌");
    }
}