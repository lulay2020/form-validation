const checkMatchMsg = document.getElementById("check-match-msg");
const checkPasswordMsg = document.getElementById("check-len-msg");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const submitBtn = document.getElementById("submit-btn");

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
		submitBtn.classList.remove('disabled');
	}
})

function checkPassword(container, msg, add, remove){
	container.textContent = msg;
	container.classList.add(add);
	container.classList.remove(remove);
}