const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add('right-panel-active')
});

signInButton.addEventListener('click', () => 
	container.classList.remove('right-panel-active')
);

// REGISTER FORM password validation

const checkMatchMsg = document.getElementById("check-match-msg");
const checkPasswordMsg = document.getElementById("check-len-msg");
const registerEmail = document.getElementById("register-email");
const registerName = document.getElementById("register-name");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const registerBtn = document.getElementById("register-btn");

password2.addEventListener('input', e=>{
	if (password.value !== password2.value) {
		checkPassword(checkMatchMsg, 'Passwords don\'t match', 'red', 'green');

	} else {
		checkPassword(checkMatchMsg, 'Passwords match', 'green', 'red');
	}
})

password.addEventListener('input', e=>{
	if (password.value.length < 6) {
		checkPassword(checkPasswordMsg, 'Password must contain more than 6 characters', 'red', 'green');
	} else {
		checkPassword(checkPasswordMsg, 'Password contains six or more charachters', 'green', 'red');
		registerBtn.classList.remove('disabled');

	}
})

function checkPassword(container, msg, add, remove){
	container.textContent = msg;
	container.classList.add(add);
	container.classList.remove(remove);
}


// LOGIN FORM validation

const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

loginPassword.addEventListener('input', e=>{
	if (loginPassword.value.length != 0 && loginEmail.value.length != 0) {
		loginBtn.classList.remove('disabled');
	} else {
		loginBtn.classList.add('disabled');
	}
})

