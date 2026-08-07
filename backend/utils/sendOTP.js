require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

async function sendOTP(email, name, otp){

    await transporter.sendMail({

        from: `"Campzo Event Manager" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "🔐 Campzo Email Verification OTP",

        html: `

<div style="max-width:650px;margin:auto;padding:30px;font-family:Arial;background:#ffffff;border-radius:10px;border:1px solid #ddd;">

<h1 style="text-align:center;color:#4F46E5;">
Campzo
</h1>

<h2 style="text-align:center;">
Email Verification
</h2>

<p>Hello <b>${name}</b>,</p>

<p>
Thank you for registering on Campzo.
</p>

<p>
Use the following OTP to verify your email address.
</p>

<div style="
margin:30px auto;
width:220px;
text-align:center;
font-size:36px;
font-weight:bold;
letter-spacing:8px;
padding:15px;
background:#EEF2FF;
color:#4F46E5;
border-radius:10px;
">

${otp}

</div>

<p>
This OTP is valid for <b>5 minutes</b>.
</p>

<p style="color:red;">
Do not share this OTP with anyone.
</p>

<hr>

<p style="text-align:center;color:gray;">
Campzo Event Management System
</p>

</div>

`

    });

}

module.exports = sendOTP;