const selectElement = s => document.querySelector(s);

// Open menu on click
selectElement(".open").addEventListener("click", () => {
  selectElement(".nav-list").classList.add("active");
});

// Close menu on click
selectElement(".close").addEventListener("click", () => {
  selectElement(".nav-list").classList.remove("active");
});

$(document).ready(function() {
  $.ajax({
    url: "/personalinfo",
    type: "GET",
    context: document.body,
    success: function(response) {
      $(".acct-name").html(response[0].fullname);
      $(".acct-loc-age").html(getAge(response[0].dob) + " • Greater Philly");
    }
  });
});

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
