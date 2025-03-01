export const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });
  
      if (response.ok) {
        try {
          const responseJson = await response.json();
          const userToken = responseJson.token;
          const userId = responseJson.user.id;
  
          console.log("Token from frontend:", userToken);
          console.log("User ID from frontend:", userId);
  
          return { success: true, userId };
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          return { success: false, error: "Error parsing server response" };
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        return { success: false, error: errorData.error };
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      return { success: false, error: "Network error. Please try again later." };
    }
  };
  