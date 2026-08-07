let scanner;

async function onScanSuccess(decodedText) {

    scanner.stop();

    document.getElementById("scannerStatus").innerHTML =
        "Checking Ticket...";

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

        if (!data.success) {

            alert(data.message);

            document.getElementById("scannerStatus").innerHTML =
                data.message;

            return;

        }

        document.getElementById("studentName").innerHTML =
            data.student.name;

        document.getElementById("eventTitle").innerHTML =
            data.student.title;

        document.getElementById("ticketId").innerHTML =
            decodedText;

        document.getElementById("attendanceStatus").innerHTML =
            "✅ Present";

        document.getElementById("scannerStatus").innerHTML =
            "Attendance Marked Successfully";

    }

    catch (err) {

        console.log(err);

        alert("Server Error");

    }

}

function onScanFailure(error) {
    // Ignore scan errors
}

window.onload = function () {

    scanner = new Html5Qrcode("reader");

    scanner.start(

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

    ).catch(err => {

        console.log(err);

        document.getElementById("scannerStatus").innerHTML =
            "❌ Camera Permission Denied";

    });

};