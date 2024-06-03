function checkLogin() {
    var userId = document.getElementById("userId").value;
    var password = document.getElementById("password").value;

    // Construct the request body
    var requestBody = {
        email: userId,
        password: password
    };

    // Make a POST request to the login endpoint
    fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST', // Changed to POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Request body included here
    })
    .then(response => {
        if (response.ok) {
            // If login is successful, redirect to the dashboard page
            window.location.href = "dashboard.html";
            alert("LogIn Successfully")
        } else {
            // If login fails, display an error message
            alert("Incorrect User ID or Password!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function registerUser() {
    // Get user input
    var email = document.getElementById("newUserId").value;
    var password = document.getElementById("newPassword").value;

    // Construct the request body
    var requestBody = {
        email: email,
        password: password
    };

    // Make a POST request to the signup endpoint
    fetch('http://localhost:3000/api/v1/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (response.ok) {
            // If signup is successful, do something (redirect, show message, etc.)
            console.log('Signup successful');
            alert("SignUp Successfully")
        } else {
            // If signup fails, handle the error (show error message, etc.)
            console.error('Signup failed');
            alert("SignUp failed")
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
