export const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };
  