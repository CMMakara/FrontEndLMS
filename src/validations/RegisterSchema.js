export const validateRegister = (data) => {
  const errors = {};

  const fullName = data.full_name?.trim();
  const username = data.username?.trim();
  const email = data.email?.trim();
  const password = data.password;
  const confirmPassword = data.confirmPassword;

  // Full Name validation
  if (!fullName) {
    errors.full_name = "Full name is required";
  } else if (fullName.length < 2) {
    errors.full_name = "Minimum 2 characters required";
  } else if (fullName.length > 100) {
    errors.full_name = "Maximum 100 characters allowed";
  }

  // Username validation
  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Minimum 3 characters required";
  } else if (username.length > 30) {
    errors.username = "Maximum 30 characters allowed";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = "Only letters, numbers, and underscore allowed";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (data.password.length > 30) {
    errors.password = "Password must not exceed 30 characters";
  } else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(data.password)
  ) {
    errors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};