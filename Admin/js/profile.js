/* =====================================================
   MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");

const sideMenu = document.getElementById("sideMenu");


menuBtn.addEventListener("click", function(event) {

    event.stopPropagation();

    sideMenu.classList.toggle("open");

});


/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.addEventListener("click", function(event) {

    if (

        sideMenu.classList.contains("open") &&

        !sideMenu.contains(event.target) &&

        event.target !== menuBtn

    ) {

        sideMenu.classList.remove("open");

    }

});



/* =====================================================
   ADMIN POPUP
===================================================== */

const adminArea = document.getElementById("adminArea");

const adminPopup = document.getElementById("adminPopup");


adminArea.addEventListener("click", function(event) {

    event.stopPropagation();

    adminPopup.classList.toggle("show");

});


document.addEventListener("click", function(event) {

    if (

        adminPopup.classList.contains("show") &&

        !adminPopup.contains(event.target) &&

        event.target !== adminArea

    ) {

        adminPopup.classList.remove("show");

    }

});



/* =====================================================
   EDIT PROFILE
===================================================== */

const editBtn = document.getElementById("editBtn");

const saveBtn = document.getElementById("saveBtn");

const cancelBtn = document.getElementById("cancelBtn");


const editableFields = [

    document.getElementById("fullName"),

    document.getElementById("email"),

    document.getElementById("phone"),

    document.getElementById("dob"),

    document.getElementById("gender")

];


let originalValues = {};


editBtn.addEventListener("click", function() {


    /* Save original values */

    originalValues = {

        fullName: document.getElementById("fullName").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        dob: document.getElementById("dob").value,

        gender: document.getElementById("gender").value

    };


    /* Enable editing */

    editableFields.forEach(function(field) {

        field.disabled = false;

    });


    editBtn.style.display = "none";

    saveBtn.style.display = "inline-block";

    cancelBtn.style.display = "inline-block";

});



/* =====================================================
   SAVE PROFILE
===================================================== */

saveBtn.addEventListener("click", function() {


    const fullName =
        document.getElementById("fullName").value.trim();


    const email =
        document.getElementById("email").value.trim();


    const phone =
        document.getElementById("phone").value.trim();


    if (fullName === "" || email === "" || phone === "") {

        alert("Please fill all required details.");

        return;

    }


    /* Update displayed name */

    document.getElementById("displayName").textContent =
        fullName;


    /* Disable editing */

    editableFields.forEach(function(field) {

        field.disabled = true;

    });


    editBtn.style.display = "inline-block";

    saveBtn.style.display = "none";

    cancelBtn.style.display = "none";


    alert("Profile updated successfully.");

});



/* =====================================================
   CANCEL EDIT
===================================================== */

cancelBtn.addEventListener("click", function() {


    document.getElementById("fullName").value =
        originalValues.fullName;


    document.getElementById("email").value =
        originalValues.email;


    document.getElementById("phone").value =
        originalValues.phone;


    document.getElementById("dob").value =
        originalValues.dob;


    document.getElementById("gender").value =
        originalValues.gender;


    editableFields.forEach(function(field) {

        field.disabled = true;

    });


    editBtn.style.display = "inline-block";

    saveBtn.style.display = "none";

    cancelBtn.style.display = "none";

});



/* =====================================================
   PROFILE PHOTO
===================================================== */

const changePhotoBtn =
    document.getElementById("changePhotoBtn");

const photoInput =
    document.getElementById("photoInput");

const profilePhoto =
    document.getElementById("profilePhoto");


changePhotoBtn.addEventListener("click", function() {

    photoInput.click();

});


photoInput.addEventListener("change", function() {


    const file = this.files[0];


    if (!file) {

        return;

    }


    const reader = new FileReader();


    reader.onload = function(event) {

        profilePhoto.innerHTML = `

            <img
                src="${event.target.result}"
                alt="Admin Profile"
            >

        `;

    };


    reader.readAsDataURL(file);

});



/* =====================================================
   TWO FACTOR AUTHENTICATION
===================================================== */

const twoFactorBtn =
    document.getElementById("twoFactorBtn");


twoFactorBtn.addEventListener("click", function() {


    this.classList.toggle("on");


    if (this.classList.contains("on")) {

        this.textContent = "ON";

    }

    else {

        this.textContent = "OFF";

    }

});



/* =====================================================
   CHANGE PASSWORD MODAL
===================================================== */

const changePasswordBtn =
    document.getElementById("changePasswordBtn");


const passwordModal =
    document.getElementById("passwordModal");


const closePasswordModal =
    document.getElementById("closePasswordModal");


changePasswordBtn.addEventListener("click", function() {

    passwordModal.classList.add("show");

});


closePasswordModal.addEventListener("click", function() {

    passwordModal.classList.remove("show");

});


passwordModal.addEventListener("click", function(event) {

    if (event.target === passwordModal) {

        passwordModal.classList.remove("show");

    }

});



/* =====================================================
   UPDATE PASSWORD
===================================================== */

const updatePasswordBtn =
    document.getElementById("updatePasswordBtn");


updatePasswordBtn.addEventListener("click", function() {


    const currentPassword =
        document.getElementById("currentPassword").value;


    const newPassword =
        document.getElementById("newPassword").value;


    const confirmPassword =
        document.getElementById("confirmPassword").value;


    const passwordMessage =
        document.getElementById("passwordMessage");


    passwordMessage.textContent = "";


    if (

        currentPassword === "" ||

        newPassword === "" ||

        confirmPassword === ""

    ) {

        passwordMessage.textContent =
            "Please fill all password fields.";

        passwordMessage.style.color = "#9b3030";

        return;

    }


    if (newPassword.length < 6) {

        passwordMessage.textContent =
            "New password must contain at least 6 characters.";

        passwordMessage.style.color = "#9b3030";

        return;

    }


    if (newPassword !== confirmPassword) {

        passwordMessage.textContent =
            "New password and confirmation do not match.";

        passwordMessage.style.color = "#9b3030";

        return;

    }


    passwordMessage.textContent =
        "Password updated successfully.";

    passwordMessage.style.color = "#287044";


    document.getElementById("currentPassword").value = "";

    document.getElementById("newPassword").value = "";

    document.getElementById("confirmPassword").value = "";

});



/* =====================================================
   LOGOUT
===================================================== */

const logoutLink =
    document.getElementById("logoutLink");


logoutLink.addEventListener("click", function(event) {


    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {

        event.preventDefault();

    }

});


const popupLogout =
    document.getElementById("popupLogout");


popupLogout.addEventListener("click", function(event) {


    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {

        event.preventDefault();

    }

});