document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = parseInt(document.getElementById("age").value);

    const userData = { name, email, age};

    try {
        const response = await fetch("http://localhost:5000/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        const responseElement = document.getElementById("response");

        if (result.success) {
            responseElement.innerHTML = `<span style="color: green;">✅ ${result.message}</span>`;
        } else {
            responseElement.innerHTML = `<span style="color: red;">❌ ${result.error}</span>`;
        }
    } catch (error) {
        document.getElementById("response").innerText = "❌ Something went wrong!";
    }
});