function handleSignup(event) {
    event.preventDefault();

    const formData = event.target.elements;
    const signupData = {
        name: formData.name.value,
        email: formData.email.value,
        password: formData.password.value
    };

    resetForm('signup');

    axios.post('http://localhost:3000/user/signup', signupData)
        .then(response => {
            displayMessage(response.data.message, response.status);
        })
        .catch(err => {
            displayMessage(err.response.data.message);
        });
};


function handleLogin(event) {
    event.preventDefault();

    const formData = event.target.elements;
    const loginData = {
        email: formData.email.value,
        password: formData.password.value
    }

    resetForm('login');

    axios.post('http://localhost:3000/user/login', loginData)
        .then(response => {
            displayMessage(response.data.message, response.status);
        })
        .catch(err => {
            displayMessage(err.response.data.message);
        });
}


function displayMessage(message, status=null) {
    const h4 = document.getElementById('message');

    let color = 'red'
    if (status === 200) {
        color = 'green'
    }
    h4.innerHTML = message;
    h4.style.color = color
};



function resetForm(formType){

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    if (formType === 'signup')
    document.getElementById('name').value = '';
    
};