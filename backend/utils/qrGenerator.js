const QRCode = require("qrcode");
const path = require("path");

async function generateQRCode(ticketId) {

    const qrPath = path.join(
        __dirname,
        "..",
        "qr",
        `${ticketId}.png`
    );

    await QRCode.toFile(qrPath, ticketId, {
        width: 350,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#FFFFFF"
        }
    });

    return qrPath;
}

module.exports = generateQRCode;