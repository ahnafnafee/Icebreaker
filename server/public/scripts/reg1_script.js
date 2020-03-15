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