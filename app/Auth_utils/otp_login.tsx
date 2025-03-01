export const handleOtpLogin = async (email: string, otp: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/otpSent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });
  
      if (response.ok) {
        const responseJson = await response.json();
        const userToken = responseJson.token;
        const userId = responseJson.user.id;
  
        return { success: true, userId };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      return { success: false, error: 'Network error. Please try again later.' };
    }
  };
  