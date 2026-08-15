require("dotenv").config();

const otpGenerator = require("otp-generator");
const otpStore = require("./otp/otpStore");
const sendOTP = require("./utils/sendOTP");
const generateQRCode = require("./utils/qrGenerator");
const generateTicket = require("./utils/ticketGenerator");
const sendTicket = require("./utils/mail");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const app = express();


// ==========================================
// 🔥 RAZORPAY
// ==========================================
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ==========================================
// 🔥 MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// 🔥 MYSQL CONNECTION
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {

    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("MySQL Connected ✅");
    }
});

// ==========================================
// 🔥 MULTER CONFIG
// ==========================================
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ==========================================
// 🔥 GET EVENTS
// ==========================================
app.get("/events", (req, res) => {

    db.query(
        "SELECT * FROM events ORDER BY id DESC",
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);
        }
    );
});

// ==========================================
// 🔥 GET SINGLE EVENT
// ==========================================
app.get("/events/:id", (req, res) => {

    db.query(
        "SELECT * FROM events WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result[0]);
        }
    );
});

// ==========================================
// 🔥 ADD EVENT
// ==========================================
app.post("/events", upload.single("image"), (req, res) => {

    const {
        title,
        description,
        date,
        time,
        price,
        mobile,
        email
    } = req.body;

    let imagePath = req.file
        ? `https://campzo.onrender.com/uploads/${req.file.filename}`
        : "";

    const sql = `
        INSERT INTO events
        (title, description, date, time, price, mobile, email, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            date,
            time,
            price,
            mobile,
            email,
            imagePath
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Event Added ✅",
                image: imagePath
            });
        }
    );
});

// ==========================================
// 🔥 UPDATE EVENT
// ==========================================
app.put("/events/:id", upload.single("image"), (req, res) => {

    const id = req.params.id;

    const {
        title,
        description,
        date,
        time,
        price
    } = req.body;

    let imagePath = req.file
        ? `https://campzo.onrender.com/uploads/${req.file.filename}`
        : null;

    let sql = "";
    let values = [];

    if (imagePath) {

        sql = `
            UPDATE events
            SET title=?, description=?, date=?, time=?, price=?, image=?
            WHERE id=?
        `;

        values = [
            title,
            description,
            date,
            time,
            price,
            imagePath,
            id
        ];

    } else {

        sql = `
            UPDATE events
            SET title=?, description=?, date=?, time=?, price=?
            WHERE id=?
        `;

        values = [
            title,
            description,
            date,
            time,
            price,
            id
        ];
    }

    db.query(sql, values, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json({
            message: "Updated Successfully"
        });
    });
});

// ==========================================
// 🔥 DELETE EVENT
// ==========================================
app.delete("/events/:id", (req, res) => {

    db.query(
        "DELETE FROM events WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Deleted Successfully"
            });
        }
    );
});
app.post("/send-otp", async (req, res) => {

    try {

        const { email, name } = req.body;

        const otp = otpGenerator.generate(6, {

            upperCaseAlphabets: false,

            lowerCaseAlphabets: false,

            specialChars: false,

            digits: true

        });

        otpStore[email] = {

            otp,

            expires: Date.now() + 5 * 60 * 1000

        };

        await sendOTP(email, name, otp);

        res.json({

            success: true,

            message: "OTP Sent Successfully"

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Unable to send OTP"

        });

    }

});

// ==========================================
// VERIFY OTP
// ==========================================
app.post("/verify-otp", (req, res) => {

    const { email, otp } = req.body;

    const savedOTP = otpStore[email];

    if (!savedOTP) {

        return res.json({

            success: false,

            message: "OTP Expired"

        });

    }

    if (Date.now() > savedOTP.expires) {

        delete otpStore[email];

        return res.json({

            success: false,

            message: "OTP Expired"

        });

    }

    if (savedOTP.otp !== otp) {

        return res.json({

            success: false,

            message: "Invalid OTP"

        });

    }

    delete otpStore[email];

    res.json({

        success: true

    });

});
// ==========================================
// 🔥 REGISTER USER
// ==========================================
app.post("/register-user", (req, res) => {

    const {
        name,
        email,
        mobile,
        password
    } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length > 0) {

                return res.json({
                    success: false,
                    message: "Email already registered"
                });

            }

            db.query(
                `INSERT INTO users
                (name,email,mobile,password)
                VALUES (?,?,?,?)`,
                [
                    name,
                    email,
                    mobile,
                    password
                ],
                (err2) => {

                    if (err2)
                        return res.status(500).json(err2);

                    res.json({

                        success: true,

                        message: "Registration Successful"

                    });

                }
            );

        }
    );

});

// ==========================================
// 🔥 LOGIN USER
// ==========================================
app.post("/login-user", (req, res) => {

    const {
        email,
        password
    } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [
            email,
            password
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0) {

                return res.json({

                    success: false,

                    message: "Invalid Email or Password"

                });

            }

            res.json({

                success: true,

                user: result[0]

            });

        }
    );

});
// ==========================================
// 🔥 GET REGISTRATIONS
// ==========================================
app.get("/registrations", (req, res) => {

    db.query(
        "SELECT * FROM registrations ORDER BY id DESC",
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json(result);
        }
    );
});
// =======================================
// DELETE REGISTRATION
// =======================================

app.delete("/deregister/:id", (req, res) => {

    const registrationId = req.params.id;

    db.query(

        "DELETE FROM registrations WHERE id=?",

        [registrationId],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,

                    message: "Database Error"

                });

            }

            if (result.affectedRows === 0) {

                return res.json({

                    success: false,

                    message: "Registration Not Found"

                });

            }

            res.json({

                success: true,

                message: "Event De-Registered Successfully"

            });

        }

    );

});
// ==========================================
// 🔥 REGISTER EVENT
// ==========================================
app.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            eventId,
            title,
            date,
            time,
            paymentStatus,
            amount
        } = req.body;

        const sql = `
            INSERT INTO registrations
            (name, email, eventId, title, date, time, paymentStatus, amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                eventId,
                title,
                date,
                time,
                paymentStatus,
                amount
            ],
            async (err, result) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json(err);
                }

                try {

                    // Generate Ticket ID
                    const ticketId =
                        "CMPZ-" +
                        String(result.insertId).padStart(6, "0");

                    // Save Ticket ID
                    db.query(
                        "UPDATE registrations SET ticketId=? WHERE id=?",
                        [ticketId, result.insertId]
                    );

                    // Format Date
                    const formattedDate = new Date(date).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            timeZone: "Asia/Kolkata"
                        }
                    );

                    // Generate QR
                    const qrPath = await generateQRCode(ticketId);

                    // Generate PDF
                    const ticketPath = await generateTicket({

                        ticketId,

                        name,

                        email,

                        title,

                        date: formattedDate,

                        time,

                        paymentStatus,

                        qrPath

                    });

                    // Send Email
                    await sendTicket({

                        ticketId,

                        name,

                        email,

                        title,

                        date: formattedDate,

                        time,

                        paymentStatus,

                        qrPath,

                        ticketPath

                    });

                    console.log("Email Sent Successfully ✅");

                    res.json({

                        success: true,

                        message: "Registration successful. Ticket emailed.",

                        ticketId

                    });

                }
                catch (error) {

                    console.error(error);

                    res.status(500).json({

                        success: false,

                        message:
                            "Registration saved but ticket/email failed.",

                        error: error.message

                    });

                }

            }

        );

    }
    catch (err) {

        console.error(err);

        res.status(500).json(err);

    }

});

app.post("/feedback", (req,res)=>{

const {
eventId,
eventTitle,
studentName,
rating,
comment
} = req.body;

db.query(
`INSERT INTO feedback
(eventId,eventTitle,studentName,rating,comment)
VALUES (?,?,?,?,?)`,
[
eventId,
eventTitle,
studentName,
rating,
comment
],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json({
success:true
});

});

});

app.get("/feedback",(req,res)=>{

db.query(
"SELECT * FROM feedback",
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

});

app.post("/scan-attendance", (req, res) => {

    const { ticketId } = req.body;

    const findSql = `
        SELECT *
        FROM registrations
        WHERE ticketId = ?
    `;

    db.query(findSql, [ticketId], (err, rows) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        if (rows.length === 0) {

            return res.json({
                success: false,
                message: "Invalid Ticket"
            });

        }

        if (rows[0].attendance === "Present") {

            return res.json({
                success: false,
                message: "Attendance Already Marked",
                student: rows[0]
            });

        }

        const updateSql = `
            UPDATE registrations
            SET attendance='Present'
            WHERE ticketId=?
        `;

        db.query(updateSql, [ticketId], (err2) => {

            if (err2) {

                console.log(err2);

                return res.status(500).json(err2);

            }

            res.json({

                success: true,

                message: "Attendance Marked Successfully",

                student: rows[0]

            });

        });

    });

});
// ==========================================
// ATTENDANCE STATS
// ==========================================

app.get("/attendance-stats", (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN attendance = 'Present' THEN 1 ELSE 0 END) AS present,
            SUM(CASE WHEN attendance = 'Present' THEN 0 ELSE 1 END) AS absent
        FROM registrations
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log("Attendance Stats Error:", err);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch attendance stats"
            });
        }

        res.json({
            success: true,
            total: result[0].total || 0,
            present: result[0].present || 0,
            absent: result[0].absent || 0
        });

    });

});
// ==========================================
// SERVE FRONTEND
// ==========================================
app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
