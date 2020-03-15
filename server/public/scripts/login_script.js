const selectElement = s => document.querySelector(s);

// Open menu on click
selectElement(".open").addEventListener("click", () => {
  selectElement(".nav-list").classList.add("active");
});

// Close menu on click
selectElement(".close").addEventListener("click", () => {
  selectElement(".nav-list").classList.remove("active");
});

function redirectURL(e) {
  window.location.href = "register.html";
}

selectElement(".forgot-reg").addEventListener("click", redirectURL);

var endpoint = "/login";
var username = selectElement("#username").value;
var password = selectElement("#password").value;
var params = {
  user: username,
  pass: password
};

$.ajax({
  url: endpoint,
  method: "POST",
  data: JSON.stringify(params),
  dataType: "json"
}).done(function(data) {
  alert("Hey");
});
// var submit = selectElement("#submit");
// var url = "/login";

// submit.addEventListener("click", POSTinfo);

// function POSTinfo(e) {
//   var username = selectElement("#username").value;
//   var password = selectElement("#password").value;
//   var params = {
//     user: username,
//     pass: password
//   };
//   console.log(params);

//   var xhr = new XMLHttpRequest();
//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
//   xhr.send(JSON.stringify(params))
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4 && xhr.status == 401) {
//       alert("Test");
//     }
//   };

//   e.preventDefault();
// }
