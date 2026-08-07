let registrations = [];

// 🔥 LOAD FROM DATABASE
function loadRegistrations() {

fetch("http://localhost:3000/registrations")
.then(res=>res.json())
.then(data=>{

registrations=data;

displayRegistrations(registrations);

})
.catch(err=>{

console.log(err);

showToast("Error loading data","error");

});

}


// PAGE LOAD
document.addEventListener(
"DOMContentLoaded",
()=>{

loadRegistrations();

}
);


// DISPLAY TABLE
function displayRegistrations(data){

const table=
document.getElementById(
"regTable"
);

table.innerHTML=`

<tr>
<th>Name</th>
<th>Email</th>
<th>Event</th>
<th>Payment</th>
<th>Action</th>
</tr>

`;

if(data.length===0){

table.innerHTML+=`
<tr>
<td colspan="5">
No Data Found
</td>
</tr>
`;

return;
}

data.forEach(reg=>{

let status=
reg.paymentStatus ||
"Success";

let amount=
reg.amount ||
"Free";

let className=
status==="Success"
?
"paid"
:
"pending";

table.innerHTML+=`

<tr>

<td>
${reg.name || "Unknown"}
</td>

<td>
${reg.email || "-"}
</td>

<td>
${reg.title || "-"}
</td>

<td>

<span class="
status
${className}
">

${status}
(
${amount==="Free"
?
"Free"
:
"₹"+amount}
)

</span>

</td>

<td>

<button
onclick="
deleteOne(
'${reg._id}'
)
">

Delete

</button>

</td>

</tr>

`;

});

}



// SEARCH
function filterData(){

let query=
document
.getElementById(
"searchInput"
)
.value
.toLowerCase();

let filtered=
registrations.filter(r=>

(r.email || "")
.toLowerCase()
.includes(query)

||

(r.title || "")
.toLowerCase()
.includes(query)

);

displayRegistrations(
filtered
);

}



// DELETE ONE
function deleteOne(id){

showConfirm(
"Delete this registration?",
()=>{

fetch(
`http://localhost:3000/delete/${id}`,
{
method:"DELETE"
}
)

.then(()=>{

showToast(
"Deleted successfully",
"success"
);

loadRegistrations();

})

.catch(err=>{

console.log(err);

showToast(
"Delete failed",
"error"
);

});

});

}



// CLEAR ALL
function clearAll(){

showConfirm(
"Delete ALL registrations?",
()=>{

Promise.all(

registrations.map(r=>

fetch(
`http://localhost:3000/delete/${r._id}`,
{
method:"DELETE"
}
)

)

)

.then(()=>{

showToast(
"All deleted",
"success"
);

loadRegistrations();

});

});

}



// EXPORT CSV
function exportCSV(){

let csv=
"Name,Email,Event,Payment\n";

registrations.forEach(r=>{

csv+=
`${r.name},
${r.email},
${r.title},
${r.paymentStatus}
(${r.amount})\n`;

});

let blob=
new Blob(
[csv],
{
type:"text/csv"
}
);

let link=
document.createElement(
"a"
);

link.href=
URL.createObjectURL(
blob
);

link.download=
"registrations.csv";

link.click();

}



// PDF DOWNLOAD
function downloadPDF(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

if(registrations.length===0){

alert("No registrations found");
return;

}

let rows=[];
let totalAmount=0;
let eventSet=new Set();

registrations.forEach(reg=>{

let amount=reg.amount || "0";

if(typeof amount==="string"){
amount=amount.replace(/[^\d]/g,"");
}

amount=parseInt(amount)||0;

totalAmount+=amount;

eventSet.add(reg.title || "-");

let paymentText="";

if((reg.paymentStatus || "Success")==="Pending"){

paymentText=
amount>0
?
`Pending (Rs.${amount})`
:
`Pending`;

}
else{

paymentText=
amount>0
?
`Success (Rs.${amount})`
:
`Success (Free)`;

}

rows.push([

reg.name || "-",
reg.email || "-",
reg.title || "-",
paymentText

]);

});


// LOAD LOGO
const logo = new Image();

logo.src="images/logo.png";


logo.onload=function(){


// FULL PAGE WATERMARK
// LIGHT WATERMARK
doc.setGState(
new doc.GState({
opacity:0.025
})
);

doc.addImage(
logo,
"PNG",
35,
90,
140,
90
);

doc.setGState(
new doc.GState({
opacity:1
})
);

// reset opacity
doc.setGState(
new doc.GState({
opacity:1
})
);


// RESET OPACITY
doc.setGState(
new doc.GState({
opacity:1
})
);


// HEADER
doc.setFontSize(22);

doc.text(
"College Event Management",
105,
20,
{align:"center"}
);

doc.setFontSize(12);

doc.text(
"Event Registration Report",
105,
28,
{align:"center"}
);

doc.line(
15,
35,
195,
35
);


// MAIN TABLE
doc.autoTable({

startY:45,

head:[[
"Name",
"Email",
"Event",
"Payment"
]],

body:rows,

theme:"grid",

styles:{
fontSize:10
},

headStyles:{
fillColor:[44,62,80]
}

});




// SUMMARY
let y=
doc.lastAutoTable.finalY+20;


doc.setFontSize(18);

doc.text(
"Summary",
20,
y
);


doc.autoTable({

startY:y+8,

head:[[
"Total Amount",
"Registered People",
"Total Events"
]],

body:[[
`Rs.${totalAmount}`,
registrations.length,
eventSet.size
]],

theme:"grid",

headStyles:{
fillColor:[26,188,156]
}

});



doc.save(
"registrations.pdf"
);

};


// if image not found
logo.onerror=function(){

alert(
"Campzo.png not found in images folder"
);

};

}


// CUSTOM CONFIRM
function showConfirm(
message,
onYes
){

const modal=
document.getElementById(
"customConfirm"
);

document
.getElementById(
"confirmText"
)
.innerText=
message;


modal.style.display=
"flex";


document
.getElementById(
"confirmYes"
)
.onclick=
()=>{

modal.style.display=
"none";

onYes();

};


document
.getElementById(
"confirmNo"
)
.onclick=
()=>{

modal.style.display=
"none";

};

}
// ================================
// SORT REGISTRATIONS
// ================================

function sortRegistrations() {

    const sortType =
    document.getElementById("sortSelect").value;

    switch(sortType){

        case "nameAZ":

            registrations.sort((a,b)=>

                (a.name || "")
                .localeCompare(
                    b.name || ""
                )

            );

        break;


        case "nameZA":

            registrations.sort((a,b)=>

                (b.name || "")
                .localeCompare(
                    a.name || ""
                )

            );

        break;


        case "paid":

            registrations.sort((a,b)=>

                (parseInt(b.amount) || 0)
                -
                (parseInt(a.amount) || 0)

            );

        break;


        case "free":

            registrations.sort((a,b)=>

                (parseInt(a.amount) || 0)
                -
                (parseInt(b.amount) || 0)

            );

        break;


        case "recent":

            registrations.sort((a,b)=>

                new Date(
                    b.createdAt || 0
                )

                -

                new Date(
                    a.createdAt || 0
                )

            );

        break;


        case "oldest":

            registrations.sort((a,b)=>

                new Date(
                    a.createdAt || 0
                )

                -

                new Date(
                    b.createdAt || 0
                )

            );

        break;


        case "popular":

            sortByPopularity(false);
            return;

        case "leastPopular":

            sortByPopularity(true);
            return;
    }

    displayRegistrations(
        registrations
    );
}



// ================================
// MOST POPULAR / LEAST POPULAR
// ================================

function sortByPopularity(
    reverse = false
){

    let count = {};

    registrations.forEach(r=>{

        let eventName =
        r.title || "Unknown";

        count[eventName] =
        (count[eventName] || 0)
        + 1;

    });

    registrations.sort((a,b)=>{

        let eventA =
        a.title || "Unknown";

        let eventB =
        b.title || "Unknown";

        return reverse

        ?

        count[eventA]
        -
        count[eventB]

        :

        count[eventB]
        -
        count[eventA];

    });

    displayRegistrations(
        registrations
    );

}