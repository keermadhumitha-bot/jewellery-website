/* =========================================================
   LUXÉORA REGISTRATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    const registerForm =
        document.getElementById("registerForm");


    if (!registerForm) {

        return;

    }


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =================================================
               GET VALUES
               ================================================= */

            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("registerPhone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const address =
                document
                    .getElementById("registerAddress")
                    .value
                    .trim();


            const city =
                document
                    .getElementById("registerCity")
                    .value
                    .trim();


            const state =
                document
                    .getElementById("registerState")
                    .value
                    .trim();


            const pincode =
                document
                    .getElementById("registerPincode")
                    .value
                    .trim();


            /* =================================================
               BASIC VALIDATION
               ================================================= */

            if (
                name === "" ||
                phone === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === "" ||
                address === "" ||
                city === "" ||
                state === "" ||
                pincode === ""
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            /* =================================================
               PHONE VALIDATION
               ================================================= */

            const phonePattern =
                /^[6-9][0-9]{9}$/;


            if (!phonePattern.test(phone)) {

                alert(
                    "Please enter a valid 10-digit phone number."
                );

                document
                    .getElementById("registerPhone")
                    .focus();

                return;

            }


            /* =================================================
               EMAIL VALIDATION
               ================================================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                document
                    .getElementById("registerEmail")
                    .focus();

                return;

            }


            /* =================================================
               PASSWORD VALIDATION
               ================================================= */

            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                document
                    .getElementById("registerPassword")
                    .focus();

                return;

            }


            /* =================================================
               CONFIRM PASSWORD
               ================================================= */

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                document
                    .getElementById("confirmPassword")
                    .focus();

                return;

            }


            /* =================================================
               PINCODE
               ================================================= */

            const pincodePattern =
                /^[0-9]{6}$/;


            if (!pincodePattern.test(pincode)) {

                alert(
                    "Please enter a valid 6-digit pincode."
                );

                document
                    .getElementById("registerPincode")
                    .focus();

                return;

            }


            /* =================================================
               GET EXISTING USERS
               ================================================= */

            let users =
                JSON.parse(
                    localStorage.getItem(
                        "luxeoUsers"
                    )
                ) || [];


            /* =================================================
               CHECK EMAIL
               ================================================= */

            const existingUser =
                users.find(function (user) {

                    return user.email === email;

                });


            if (existingUser) {

                alert(
                    "An account already exists with this email address."
                );

                document
                    .getElementById("registerEmail")
                    .focus();

                return;

            }


            /* =================================================
               CREATE USER
               ================================================= */

            const newUser = {

                id:
                    Date.now(),

                name:
                    name,

                phone:
                    phone,

                email:
                    email,

                password:
                    password,

                address:
                    address,

                city:
                    city,

                state:
                    state,

                pincode:
                    pincode,

                status:
                    "active",

                createdAt:
                    new Date().toISOString()

            };


            /* =================================================
               SAVE USER
               ================================================= */

            users.push(newUser);


            localStorage.setItem(
                "luxeoUsers",
                JSON.stringify(users)
            );


            /* =================================================
               SUCCESS
               ================================================= */

            alert(
                "Your Luxéora account has been created successfully!"
            );


            /* =================================================
               GO TO LOGIN
               ================================================= */

            window.location.href =
                "login.html";

        }
    );

});