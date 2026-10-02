document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       CREATE DEFAULT TEST ACCOUNT
    ========================================= */

    let users = JSON.parse(
        localStorage.getItem("luxeoUsers") || "[]"
    );


    /*
       Create test account if it doesn't already exist
    */

    const testEmail = "test@luxeora.com";

    const testUserExists = users.some(function (user) {
        return user.email === testEmail;
    });


    if (!testUserExists) {

        const testUser = {

            id: Date.now(),

            name: "Test User",

            email: "test@luxeora.com",

            phone: "9876543210",

            password: "123456",

            address: "123 Jewellery Street",

            city: "Chennai",

            state: "Tamil Nadu",

            pincode: "600001",

            status: "active",

            provider: "local",

            createdAt: new Date().toISOString()

        };


        users.push(testUser);

        localStorage.setItem(
            "luxeoUsers",
            JSON.stringify(users)
        );
    }


    /* =========================================
       LOGIN FORM
    ========================================= */

    const loginForm =
        document.getElementById("loginForm");


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const identifier =
            document
                .getElementById("loginIdentifier")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        if (identifier === "" || password === "") {

            alert("Please enter your email/phone and password.");

            return;
        }


        /* Get latest users */

        users = JSON.parse(
            localStorage.getItem("luxeoUsers") || "[]"
        );


        /* Find user */

        const user = users.find(function (account) {

            const emailMatch =
                account.email &&
                account.email.toLowerCase() === identifier;


            const phoneMatch =
                account.phone &&
                account.phone === identifier;


            return (
                (emailMatch || phoneMatch) &&
                account.password === password
            );

        });


        /* =========================================
           INVALID LOGIN
        ========================================= */

        if (!user) {

            alert(
                "Invalid email/phone number or password."
            );

            return;
        }


        /* =========================================
           CHECK BLOCKED USER
        ========================================= */

        if (user.status === "blocked") {

            alert(
                "Your account has been blocked. Please contact Luxéora support."
            );

            return;
        }


        /* =========================================
           SAVE LOGGED-IN USER
        ========================================= */

        localStorage.setItem(
            "luxeoCurrentUser",
            JSON.stringify(user)
        );


        /* =========================================
           LOGIN SUCCESS
        ========================================= */

        alert(
            "Welcome back, " + user.name + "!"
        );


        window.location.href = "home.html";

    });


    /* =========================================
       GOOGLE LOGIN
    ========================================= */

    const googleLogin =
        document.getElementById("googleLogin");


    if (googleLogin) {

        googleLogin.addEventListener(
            "click",
            function () {

                alert(
                    "Google login needs Google OAuth/Firebase configuration. The login button is ready for integration."
                );

            }
        );

    }


    /* =========================================
       FACEBOOK LOGIN
    ========================================= */

    const facebookLogin =
        document.getElementById("facebookLogin");


    if (facebookLogin) {

        facebookLogin.addEventListener(
            "click",
            function () {

                alert(
                    "Facebook login needs Facebook OAuth configuration. The login button is ready for integration."
                );

            }
        );

    }


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    const forgotPassword =
        document.getElementById("forgotPassword");


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "Password reset functionality will be added later."
                );

            }
        );

    }

});