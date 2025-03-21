const API_URL = "http://localhost:3000/api";

// Toggle Forms
function showLogin() {
    document.getElementById("auth").style.display = "block";
    document.getElementById("register").style.display = "none";
}

function showRegister() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("register").style.display = "block";
}

// Signup User
async function register() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Signup successful! Please login.");
        showLogin();
    } else {
        alert(`Error: ${data.message}`);
    }
}

// Login User
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login credentials");
    }
}

// Logout User
function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}