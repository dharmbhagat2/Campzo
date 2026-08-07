function submitFeedback(){

fetch(
"http://localhost:3000/feedback",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

eventId:event.id,
eventTitle:event.title,

studentName:
localStorage.getItem("userName"),

rating:
document.getElementById("rating").value,

comment:
document.getElementById("comment").value

})
}
)

.then(res=>res.json())
.then(()=>{

alert("Feedback Submitted");

});

}