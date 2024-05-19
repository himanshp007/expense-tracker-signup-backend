
window.addEventListener('DOMContentLoaded', ()=> {

    const token = localStorage.getItem('token')

    axios.get('http://localhost:3000/expense/get-expense', {headers: {'Authorization': token}})
        .then( (response) => { 
            if (response.data.premiumuserCheck) {
                const button = document.getElementById('rzrpay-btn');
                
                if (button) {
                    button.remove();
                    premiumUser();
                }
            }
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

document.getElementById('rzrpay-btn').onclick = async function(event) {
    console.log('button')
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/purchase/premiummembership`, {headers: {"Authorization": token}});

    var options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,

        'handler': async function (response) {
            await axios.post(`http://localhost:3000/purchase/updatetransactionstatus`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers: {'Authorization': token}})

            const button = document.getElementById('rzrpay-btn');
            button.remove();

            alert("You are premium user now")

            premiumUser();
        },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    event.preventDefault();

    rzp1.on('payment.failed', function(response) {
        console.log(response);
        alert("Something went wrong");
    })
}


function premiumUser() {
    const premiumDiv = document.getElementsByClassName('premium-user')[0];
    const headingElement = document.createElement('h4');
    headingElement.innerHTML = "You are a Premium User";
    const leaderBtn = document.createElement('button');
    leaderBtn.textContent = "Show Leaderboard";
    leaderBtn.id = 'leaderbtn'
    headingElement.appendChild(leaderBtn);
    premiumDiv.appendChild(headingElement);

    leaderBtn.onclick = async function(event) {

        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/premium/showleaderboard', { headers: { 'Authorization': token }})
        .then(response => {
            console.log(response.data.result)
            
            const data = response.data.result;

            const body = document.getElementsByTagName('body')[0];
            const ul = document.createElement('ul');
            ul.id = 'leaderlist';
            body.appendChild(ul);

            const allitems = document.getElementById('leaderlist');
            data.forEach(item => {
                const listItem = document.createElement('li');
                const p = document.createElement('p');
                p.innerHTML = `Name: ${item.name} - Total Expense - ${item.total}`;
                listItem.appendChild(p);
                allitems.appendChild(listItem);
            })

         })

    }
}

function createLeader() {
    const body = document.getElementsByTagName('body')[0];
    const leaderHeading = document.createElement('h4');
    leaderHeading.id = 'leaderheading';
    leaderHeading.innerHTML = "Leaderboard";

    body.appendChild(leaderHeading);
}


