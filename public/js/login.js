const loginForm=document.getElementById('loginForm');


async function loginUser(loginData) {
  try {
    const res = await axios.post('http://localhost:2000/api/users/login', loginData);
  alert('Login successful!');
    console.log(res.data);
    localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));

    window.location.href = '/index.html';
  } catch (err) {
    console.error(err);
    alert('Login  failed');
  }
}

loginForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const form = event.target;
     const email = form.email.value;
  const password = form.password.value;
  const loginData = { email, password };

loginUser(loginData);
})