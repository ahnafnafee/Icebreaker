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
    }
  });
});
