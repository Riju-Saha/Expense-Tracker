export const handleRegister = async (name: string, email: string, password: string, phone: string) => {
    // Validate phone number before sending to the backend
    if (!/^\d{10}$/.test(phone)) {
      return { success: false, error: 'Phone number must be exactly 10 digits.' };
    }
  
    const formData = { name, email, password, phone };
    console.log("Form data to submit:", formData);
  
    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        return { success: true };
      } else {
        const errorData = await response.json();
        let errorMessage = 'Registration failed. Please try again.';
  
        if (errorData.error.includes('name and email')) {
          errorMessage = 'The name and email are already registered. Please try another.';
        } else if (errorData.error.includes('name')) {
          errorMessage = 'The name is already registered. Please choose another name.';
        } else if (errorData.error.includes('email')) {
          errorMessage = 'The email is already registered. Please use another email.';
        } else if (errorData.error.includes('Phone number')) {
          errorMessage = errorData.error;
        }
  
        console.error("Registration failed:", errorData);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      return { success: false, error: 'Error submitting form. Please try again later.' };
    }
  };
  