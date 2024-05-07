function handleFormSubmit(event) {
    event.preventDefault();

    const formData = event.target.elements;
    const userData = {
        name: formData.name.value,
        email: formData.email.value,
        password: formData.password.value
    };

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    axios.post('http://localhost:3000/user/signup', userData)
        .then(response => {
            displayMessage(response.data.message);
        })
        .catch(err => {
            displayMessage(err.message);
        });
};

function displayMessage(message) {
    const h4 = document.getElementById('message');

    h4.innerHTML = message;
};