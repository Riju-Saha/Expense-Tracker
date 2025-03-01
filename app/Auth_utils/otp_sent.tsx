export const handleOtpSent = async (email: string) => {
    if (email.trim().length < 2) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/users/userCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || "This email doesn't exist." };
      }
    } catch (error) {
      console.error('Network error:', error);
      return { success: false, error: 'Something went wrong. Please try again later.' };
    }
  };
  