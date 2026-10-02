// Get the login form
const loginForm = document.getElementById("loginForm");

// Get the message area
const loginMessage = document.getElementById("loginMessage");


// When the user clicks SIGN IN
loginForm.addEventListener("submit", function (event) {

    // Stop the page from refreshing
    event.preventDefault();

    // Get email and password
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();


    // Demo admin login details
    const adminEmail = "admin@luxora.com";
    const adminPassword = "admin123";


    // Check login details
    if (email === adminEmail && password === adminPassword) {

        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";


        // Go to dashboard
        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 500);

    }

    else {

        loginMessage.textContent = "Invalid email or password.";
        loginMessage.style.color = "red";

    }

});