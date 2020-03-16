const selectElement = s => document.querySelector(s);

// Open menu on click
selectElement('.open').addEventListener('click', () => {
    selectElement('.nav-list').classList.add('active');
});

// Close menu on click
selectElement('.close').addEventListener('click', () => {
    selectElement('.nav-list').classList.remove('active');
});


$("#datetime").flatpickr({
    dateFormat: "d.m.Y",
    maxDate: "today"
});

function redirectURL(e) {
    window.location.href = "login.html";
}

selectElement(".forgot-reg").addEventListener("click", redirectURL);

$(function() {
    $("#submit").on("click", function(event) {
      event.preventDefault();
  
      let username = $("#username");
      let password = $("#password");
      console.log(JSON.stringify({ user: username.val(), pass: password.val() }));
  
      $.ajax({
        url: "/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          username: username.val(),
          password: password.val()
        }),
        success: function(response) {
          window.location = response;
        },
        statusCode: {
            401: () => {
                alert("Unauthorized");
            }
        }
      });
    });
  });