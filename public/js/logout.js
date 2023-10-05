const logoutUser = async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      throw new Error(`Logout failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred during logout');
  }
};

document.querySelector('#logout').addEventListener('click', logoutUser);
