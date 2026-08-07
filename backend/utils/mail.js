require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

async function sendTicket(ticketData){

    console.log("================================");
    console.log("Starting Email...");
    console.log("To:", ticketData.email);
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass Exists:", !!process.env.EMAIL_PASS);
    console.log("================================");

    // ===========================
    // Format Date
    // ===========================
    const eventDate = new Date(ticketData.date);

    const formattedDate = new Date(ticketData.date)
    .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata"
    });
    try{

        const info = await transporter.sendMail({

            from: `"Campzo Event Manager" <${process.env.EMAIL_USER}>`,

            replyTo: process.env.EMAIL_USER,

            to: ticketData.email,

            subject: `🎉 Registration Confirmed - ${ticketData.title}`,

            html: `

<div style="max-width:700px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;border-radius:10px;padding:30px;border:1px solid #ddd;">

    <h1 style="color:#4e73df;text-align:center;">
        🎉 Welcome to Campzo
    </h1>

    <p style="font-size:16px;">
        Hello <b>${ticketData.name}</b>,
    </p>

    <p>
        Your registration has been successfully confirmed.
    </p>

    <table style="width:100%;border-collapse:collapse;margin-top:20px;">

        <tr>
            <td style="padding:10px;"><b>🎫 Event</b></td>
            <td>${ticketData.title}</td>
        </tr>

        <tr>
            <td style="padding:10px;"><b>📅 Date</b></td>
            <td>${formattedDate}</td>
        </tr>

        <tr>
            <td style="padding:10px;"><b>🕘 Time</b></td>
            <td>${ticketData.time}</td>
        </tr>

        <tr>
            <td style="padding:10px;"><b>🆔 Ticket ID</b></td>
            <td>${ticketData.ticketId}</td>
        </tr>

        <tr>
            <td style="padding:10px;"><b>💳 Payment</b></td>
            <td>${ticketData.paymentStatus}</td>
        </tr>

    </table>

    <hr style="margin:30px 0;">

    <h3 style="color:#4e73df;">
        📎 Attachments Included
    </h3>

    <ul>
        <li>✅ Event Ticket (PDF)</li>
        <li>✅ QR Code</li>
    </ul>

    <p>
        Please carry your Event Ticket or show it on your mobile while entering the event.
    </p>

    <p>
        The attached QR Code will be scanned for attendance verification.
    </p>

    <hr>

    <p style="text-align:center;font-size:18px;color:#4e73df;">
        ❤️ Thank you for choosing Campzo
    </p>

    <p style="text-align:center;color:#666;">
        Campzo Event Management System
        <br>
        Email: campzo.eventmanager@gmail.com
    </p>

</div>

            `,

            attachments:[

                {
                    filename:"EventTicket.pdf",
                    path:ticketData.ticketPath
                },

                {
                    filename:"QRCode.png",
                    path:ticketData.qrPath,
                    cid:"qrcode"
                }

            ]

        });

        console.log("================================");
        console.log("EMAIL SENT SUCCESSFULLY ✅");
        console.log(info);
        console.log("================================");

    }
    catch(err){

        console.log("================================");
        console.log("EMAIL ERROR ❌");
        console.log(err);
        console.log("================================");

        throw err;

    }

}

module.exports = sendTicket;