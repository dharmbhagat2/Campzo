const generateQRCode = require("./utils/qrGenerator");

generateQRCode("CMPZ-2027-0001")
.then(path=>{
    console.log(path);
})
.catch(console.error);