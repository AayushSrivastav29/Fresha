const signupForm=document.getElementById('signupForm');


async function signUpUser(formData) {
  try {
    const res = await axios.post('http://localhost:2000/api/users/register', formData);
    alert('Signup successful!');
    console.log(res.data);
  } catch (err) {
    console.error(err);
    alert('Signup failed');
  }
}

signupForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const form = event.target;
const formData = new FormData();

formData.append('name', form.name.value);
formData.append('email', form.email.value);
formData.append('phone', form.phone.value);
formData.append('gender', form.gender.value);
formData.append('role', 'customer');
formData.append('avatar', form.avatar.files[0]); 
formData.append('password', form.password.value);
signUpUser(formData);
})