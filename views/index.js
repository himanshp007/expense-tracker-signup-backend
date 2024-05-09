
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
            // displayMessage(response.data.message, response.status);
            window.location.href = 'http://127.0.0.1:5500/views/add-expense.html';
        })
        .catch(err => {
            displayMessage(err.response.data.message);
        });
}


function handleAddExpense(event) {
    event.preventDefault();

    const formData = event.target.elements;

    const expenseData = {
        amount: formData.amount.value,
        description: formData.description.value,
        category: formData.category.value,
    }

    axios.post('http://localhost:3000/expense/add-expense', expenseData)
        .then(response => {
            displayExpenses();
        })
        .catch(err => {
            displayMessage(err.response.data.message);
        });
}





function displayExpenses() {

    axios.get('http://localhost:3000/expense/get-expense')
        .then( (response) => { 
            const allItems = document.querySelector('ul');
            allItems.innerHTML = "";

            const data = response.data.result;

            data.forEach(item => {
                const listItem = createFront(item);
                allItems.appendChild(listItem);
            })
            
        })
        .catch(err => console.log(err))
};



function createFront(item) {
    const listItem = document.createElement('li');
    const p = document.createElement('p');
    p.innerHTML = `${item.amount} - ${item.description} - ${item.category}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete'

    deleteBtn.addEventListener('click', async () => {
        try {
            await axios.delete(`http://localhost:3000/expense/delete-expense/${item.id}`);
            displayExpenses();
        } catch (err) {
            console.log(err);
        }
    });

    p.appendChild(deleteBtn);
    listItem.appendChild(p);

    return listItem;
};



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

displayExpenses();