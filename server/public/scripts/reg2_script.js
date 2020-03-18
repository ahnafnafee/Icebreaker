var formData = new FormData();
var formData2 = new FormData();
let count = 0;

const selectElement = s => document.querySelector(s);

// Open menu on click
selectElement(".open").addEventListener("click", () => {
  selectElement(".nav-list").classList.add("active");
});

// Close menu on click
selectElement(".close").addEventListener("click", () => {
  selectElement(".nav-list").classList.remove("active");
});

$("#submit").click(false);
$("#submit").css("background", "rgb(170, 170, 170)");

const extraImgBtn = document.getElementById("user-img");
const customBtn = document.getElementById("custom-button");
const imgCtn = document.querySelector("#selected-img");

const imgFile = document.getElementById("user-dp");
const dpLabel = document.querySelector(".custom-file-upload");

let node = document.createElement("img");

imgFile.addEventListener("change", function() {
  if (imgFile.value) {
    console.log(this.files);
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      formData.append("userDp", file);

      console.log(file.size);
      if (file.size / 1024 / 1024 > 1) {
        return alert("File size exceeds 1 MB");
      }

      $(".custom-file-upload").click(false);
      $("#user-dp").click(false);
      ++count;

      reader.addEventListener("load", function() {
        console.log(formData);
        console.log(this);
        dpLabel.style.content = `url(${this.result})`;
      });

      reader.readAsDataURL(file);
    }
  }
});

customBtn.addEventListener("click", function() {
  extraImgBtn.click();
});

extraImgBtn.addEventListener("change", function() {
  if (extraImgBtn.value) {
    let x = [this.files];
    console.log(x);
    let fileArr = this.files;
    console.log(this.files);
    const file = this.files[0];
    if (file) {
      ++count;

      for( var i =0; i< fileArr.length ; i++ ){
        formData2.append('imgArr[]' , fileArr[i] );
    }

      console.log(fileArr);

      for (var i = 0; i < fileArr.length; i++) {
        const reader = new FileReader();
        console.log(i);

        if (fileArr[i].size / 1024 / 1024 > 1) {
          return alert("File size exceeds 1 MB");
        }

        reader.addEventListener("load", async function() {
          console.log(this);
          let myEle = document.createElement("img");
          myEle.style.content = `url(${this.result})`;
          imgCtn.appendChild(myEle);
        });

        reader.readAsDataURL(fileArr[i]);
      }
    }
  }
});

selectElement("#submit").addEventListener("click", async () => {
  if (count > 1) {
    $("#submit").css("background", "#4DDBB4");
    console.log(formData);
    submitForm();
  }
});

async function submitForm() {
  formData.append("userDesc", $(".acct-desc").val());

  await $.ajax({
    url: "/reg1",
    data: formData,
    method: "POST",
    type: "POST",
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false, // NEEDED, DON'T OMIT THIS
    error: err => {
      console.log(err);
    }
    // ... Other options like success and etc
  });

  await $.ajax({
    url: "/reg2",
    data: formData2,
    method: "POST",
    type: "POST",
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false, // NEEDED, DON'T OMIT THIS
    success: function(data) {
      window.location.href = "/main";
    },
    error: err => {
      console.log(err);
    }
    // ... Other options like success and etc
  });
}
