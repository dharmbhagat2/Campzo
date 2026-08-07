const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateTicket(ticketData) {
    const formattedDate = new Date(ticketData.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata"
});

    return new Promise((resolve, reject) => {

        const ticketPath = path.join(
            __dirname,
            "..",
            "tickets",
            `${ticketData.ticketId}.pdf`
        );

        const doc = new PDFDocument({
    size: [700, 280],   // Width × Height
    margin: 20
});

        const stream = fs.createWriteStream(ticketPath);

        doc.pipe(stream);

        // =========================
// BACKGROUND
// =========================

// Left Side
// =========================
// PREMIUM BACKGROUND
// =========================

// Full Dark Background
doc
.save()
.rect(0,0,700,280)
.fill("#0F172A");

// Main Card
doc
.roundedRect(
20,
20,
660,
240,
18
)
.fill("#1E293B");

// Header Strip
doc
.roundedRect(
20,
20,
660,
50,
18
)
.fill("#4F46E5");

// Right QR Panel
doc
.roundedRect(
495,
20,
185,
240,
18
)
.fill("#0EA5E9");

doc.restore();
        // =========================
        // CAMPZO LOGO
        // =========================

        const logoPath = path.join(
            __dirname,
            "..",
            "..",
            "images",
            "logo.png"
        );

        if(fs.existsSync(logoPath)){

           doc.image(logoPath,35,25,{
    width:40
});

        }

        // =========================
        // TITLE
        // =========================

        doc
.fontSize(26)
.font("Helvetica-Bold")
.fillColor("#FFFFFF")
.text("CAMPZO EVENT PASS",135,33);

doc
.fontSize(10)
.font("Helvetica")
.fillColor("#D1D5DB")
.text("Digital Entry Ticket",135,58);


        doc.moveDown();

       doc
.font("Helvetica-Bold")
.fontSize(17)
.fillColor("#FACC15")
.text("TICKET INFORMATION",35,90);

doc
.font("Helvetica")
.fontSize(12)
.fillColor("#FFFFFF");

doc.text(`Ticket ID : ${ticketData.ticketId}`,35,120);

doc.text(`Name     : ${ticketData.name}`,35,145);

doc.text(`Event     : ${ticketData.title}`,35,170);

doc.text(`Date      : ${formattedDate}`,35,195);

doc.text(`Time      : ${ticketData.time}`,35,220);


        // =========================
        // QR CODE
        // =========================

        if(fs.existsSync(ticketData.qrPath)){

     doc.image(
ticketData.qrPath,
520,
75,
{
    width:120
}
);

doc
.fontSize(10)
.font("Helvetica")
.fillColor("#E5E7EB")
.text(
"Show this QR at the event gate",
505,
200,
{
width:150,
align:"center"
}
);

        }


doc
.moveTo(25,235)
.lineTo(675,235)
.strokeColor("#475569")
.stroke();

doc
.fontSize(9)
.font("Helvetica")
.fillColor("#CBD5E1")
.text(
"Powered by Campzo",
35,
245
);

doc
.font("Helvetica-Bold")
.fillColor("#CBD5E1")
.text(
"www.campzo.in",
530,
245
);

        doc.end();

        stream.on("finish",()=>{

            resolve(ticketPath);

        });

        stream.on("error",reject);

    });

}

module.exports = generateTicket;