let scanner;
let isScanning = false;
let isProcessing = false;


// ==========================================
// START QR SCANNER
// ==========================================

async function startScanner() {

    if (isScanning) {
        return;
    }

    try {

        document.getElementById("scannerStatus").innerHTML =
            "📷 Ready to Scan Next Ticket";

        document.getElementById("scanNextBtn").style.display =
            "none";

        isScanning = true;

        await scanner.start(

            {
                facingMode: "environment"
            },

            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },

            onScanSuccess,

            onScanFailure

        );

    }

    catch (err) {

        console.log("Scanner Start Error:", err);

        isScanning = false;

        document.getElementById("scannerStatus").innerHTML =
            "❌ Unable to start camera";

    }

}


// ==========================================
// STOP QR SCANNER
// ==========================================

async function stopScanner() {

    if (!isScanning) {
        return;
    }

    try {

        await scanner.stop();

        isScanning = false;

    }

    catch (err) {

        console.log("Scanner Stop Error:", err);

        isScanning = false;

    }

}


// ==========================================
// QR SCAN SUCCESS
// ==========================================

async function onScanSuccess(decodedText) {

    // Prevent the same QR from being processed multiple times
    if (isProcessing) {
        return;
    }

    isProcessing = true;

    // Stop camera immediately
    await stopScanner();

    document.getElementById("scannerStatus").innerHTML =
        "⏳ Checking Ticket...";

    try {

        const response = await fetch(
            "https://campzo.onrender.com/scan-attendance",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    ticketId: decodedText

                })

            }
        );


        const data = await response.json();


        // ==========================================
        // INVALID / ALREADY MARKED
        // ==========================================

        if (!data.success) {

            document.getElementById("scannerStatus").innerHTML =
                "⚠️ " + data.message;

            document.getElementById("attendanceStatus").innerHTML =
                data.message;

            // Show Scan Next button
            document.getElementById("scanNextBtn").style.display =
                "inline-block";

            isProcessing = false;

            return;

        }


        // ==========================================
        // ATTENDANCE SUCCESS
        // ==========================================

        document.getElementById("studentName").innerHTML =
            data.student.name;

        document.getElementById("eventTitle").innerHTML =
            data.student.title;

        document.getElementById("ticketId").innerHTML =
            decodedText;

        document.getElementById("attendanceStatus").innerHTML =
            "✅ Present";

        document.getElementById("scannerStatus").innerHTML =
            "✅ Attendance Marked Successfully";


        // Show Scan Next button
        document.getElementById("scanNextBtn").style.display =
            "inline-block";


        // Update present count
       await loadAttendanceStats();


        isProcessing = false;

    }

    catch (err) {

        console.log("Server Error:", err);

        document.getElementById("scannerStatus").innerHTML =
            "❌ Server Error";

        document.getElementById("attendanceStatus").innerHTML =
            "Server Error";


        // Allow user to try again
        document.getElementById("scanNextBtn").style.display =
            "inline-block";

        isProcessing = false;

    }

}


// ==========================================
// QR SCAN FAILURE
// ==========================================

function onScanFailure(error) {

    // Ignore normal QR scan failures
}


// ==========================================
// SCAN NEXT TICKET BUTTON
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    scanner = new Html5Qrcode("reader");
    loadAttendanceStats();


    const scanNextBtn =
        document.getElementById("scanNextBtn");


    scanNextBtn.addEventListener("click", async function () {

        // Hide button
        scanNextBtn.style.display = "none";


        // Reset previous attendance information
        document.getElementById("studentName").innerHTML =
            "-";

        document.getElementById("eventTitle").innerHTML =
            "-";

        document.getElementById("ticketId").innerHTML =
            "-";

        document.getElementById("attendanceStatus").innerHTML =
            "Waiting...";


        isProcessing = false;


        // Start scanner again
        await startScanner();

    });

// ==========================================
// LOAD ATTENDANCE STATS
// ==========================================

async function loadAttendanceStats() {

    try {

        const response = await fetch(
            "https://campzo.onrender.com/attendance-stats"
        );

        const data = await response.json();

        if (!data.success) {
            return;
        }

        document.getElementById("presentCount").innerHTML =
            data.present;

        document.getElementById("absentCount").innerHTML =
            data.absent;

    }

    catch (err) {

        console.log("Stats Error:", err);

    }

}
    // Start scanner when page opens
    startScanner();

});