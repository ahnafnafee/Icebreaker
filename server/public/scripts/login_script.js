const selectElement = s => document.querySelector(s);

// Open menu on click
selectElement('.open').addEventListener('click', () => {
    selectElement('.nav-list').classList.add('active');
});

// Close menu on click
selectElement('.close').addEventListener('click', () => {
    selectElement('.nav-list').classList.remove('active');
});

function redirectURL(e) {
    window.location.href = "register.html";
}

selectElement(".forgot-reg").addEventListener("click", redirectURL);


var submit = selectElement("#submit");
var url = "";

submit.addEventListener("click", POSTinfo);

function POSTinfo(e) {
  var username = selectElement("#username").value;
  var password = selectElement("#password").value;
  var params = `username=${username}&password=${password}`;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      alert(xhr.responseText);
    }
  };
  xhr.send(params);

  e.preventDefault();
}
