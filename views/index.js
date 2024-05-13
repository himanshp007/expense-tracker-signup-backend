window.addEventListener('DOMContentLoaded', ()=> {

    const token = localStorage.getItem('token')

    axios.get('http://localhost:3000/expense/get-expense', {headers: {'Authorization': token}})
        .then( (response) => { 
            
            displayExpenses();
        })
        .catch(err => console.log(err))

});




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
            localStorage.setItem('token', response.data.token);
            window.location.href = '../views/add-expense.html';
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

    resetForm('addExpense');

    const token = localStorage.getItem('token')
    axios.post('http://localhost:3000/expense/add-expense',expenseData, {headers: {'Authorization': token}})
        .then(response => {
            displayExpenses();
        })
        .catch(err => {
            displayMessage(err.response.data.message);
        });
}





function displayExpenses() {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/expense/get-expense', { headers: { 'Authorization': token }})
        .then(response => { 
            const allItems = document.querySelector('ul');
            allItems.innerHTML = "";

            const data = response.data.result;
            console.log(data)

            data.forEach(item => {
                const listItem = createFront(item, token); 
                allItems.appendChild(listItem);
            })
        })
        .catch(err => console.log(err))
}

function createFront(item, token) {
    const listItem = document.createElement('li');
    const p = document.createElement('p');
    p.innerHTML = `${item.amount} - ${item.description} - ${item.category}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete'

    deleteBtn.addEventListener('click', async () => {
        try {
            await axios.delete(`http://localhost:3000/expense/delete-expense/${item.id}`, { headers: { 'Authorization': token }});
            displayExpenses();
        } catch (err) {
            console.log(err);
        }
    });

    p.appendChild(deleteBtn);
    listItem.appendChild(p);

    return listItem;
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

    if (formType === 'login') {
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }else if (formType === 'signup') {
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('name').value = '';
    }else if (formType === 'addExpense') {
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        document.getElementById('category').value = '';
    }
    
};