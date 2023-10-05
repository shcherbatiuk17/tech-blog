const handleLoginFormSubmit = async (event) => {
  event.preventDefault();

  const emailInput = document.querySelector('#email-login');
  const passwordInput = document.querySelector('#password-login');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email && password) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(`Login failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login');
    }
  }
};

const handleSignupFormSubmit = async (event) => {
  event.preventDefault();

  const nameInput = document.querySelector('#name-signup');
  const emailInput = document.querySelector('#email-signup');
  const passwordInput = document.querySelector('#password-signup');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (name && email && password) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(`Signup failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during signup');
    }
  }
};

document.querySelector('.login-form').addEventListener('submit', handleLoginFormSubmit);

document.querySelector('.signup-form').addEventListener('submit', handleSignupFormSubmit);
