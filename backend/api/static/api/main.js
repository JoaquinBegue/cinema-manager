document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (token) {
    console.log("logged in")
  } else {
    console.log("not logged in")
  }

});

function login () {
  const loginForm = document.getElementById('login-form');
  const email = loginForm.querySelector('#login-email').value;
  const password = loginForm.querySelector('#login-password').value;

  // Data to send to the token endpoint
  const data = {
    username: email,
    password: password,
  };

  // Fetch API to send the POST request
  fetch('/api/auth/token/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 401)
        throw new Error('Login failed');
    }
    return response.json(); // Parse the JSON response
  })
  .then(responseData => {
    // Store the token (e.g., in localStorage)
    localStorage.setItem('access_token', responseData.access);
    localStorage.setItem('refresh_token', responseData.refresh);
    // Refresh the page
    window.location.reload();
    console.log("logged in")
  })
  .catch(error => {
    // Handle errors (e.g., display an error message)
    console.error('Error:', error);
    alert('Login failed. Please check your credentials.');
  });
}
