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
  $(window).on("load", function() {
    var lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy"
      // ... more custom settings?
    });
  });

  $.ajax({
    url: "/allinfo",
    type: "GET",
    context: document.body,
    success: async function(response) {
      let carousel = selectElement(".carousel");
      let imgArr = response[0].imgArr.split(",");

      imgArr.forEach(function(item) {
        console.log(1);
        let div = document.createElement("div");
        div.classList.add("carousel-cell");
        carousel.appendChild(div);
        let imgCtn = document.createElement("img");
        imgCtn.classList.add("carousel-cell-image");
        imgCtn.setAttribute("src", `${item}`);
        div.appendChild(imgCtn);
        console.log(2);
      });

      $(".user-name").html(response[0].fullname);
      $(".user-loc-age").html(getAge(response[0].dob) + " • Greater Philly");
      $(".aboutme-desc").html(response[0].userdesc);
      $(".user-dp").css("content", `url("${response[0].userdp}")`);
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
