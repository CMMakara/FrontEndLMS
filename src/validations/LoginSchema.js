export const validateLogin = (data) => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Email or Username
  if (!data.emailOrUsername?.trim()) {
    errors.emailOrUsername = "Email or Username is required";
  } else {
    const value = data.emailOrUsername.trim();

    // If it contains @, treat it as email
    if (value.includes("@") && !emailRegex.test(value)) {
      errors.emailOrUsername = "Invalid email format";
    }
  }

  // Password
  if (!data.password) {
    errors.password = "Password is required";
  } 

  return errors;
};