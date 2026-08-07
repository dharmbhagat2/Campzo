const generateTicket = require("./utils/ticketGenerator");

generateTicket({

    ticketId:"CMPZ-2027-0001",

    name:"Dharm Bhagat",

    email:"test@gmail.com",

    title:"Parul Fest 2027",

    date:"08 June 2026",

    time:"09:00 PM",

    paymentStatus:"Success",

    qrPath:"./qr/CMPZ-2027-0001.png"

})
.then(path=>{

    console.log(path);

})
.catch(console.error);