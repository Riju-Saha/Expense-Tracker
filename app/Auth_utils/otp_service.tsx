const fetchApi = async (url: string, body: object) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const responseJson = await response.json();
    return response.ok
      ? { success: true, userId: responseJson.user?.id }
      : { success: false, error: responseJson.error || responseJson.message };
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
};

export const handleOtpSent = async (email: string) => {
  if (email.trim().length < 2) {
    return { success: false, error: "Please provide a valid email address." };
  }
  return fetchApi("http://localhost:8000/api/users/userCheck", { email });
};

export const handleOtpLogin = (email: string, otp: string) =>
  fetchApi("http://localhost:8000/api/users/otpSent", { email, otp });

export const handleVerifyOtpLogin = (email: string, otp: string) =>
  fetchApi("http://localhost:8000/api/users/otpVerifySent", { email, otp });
