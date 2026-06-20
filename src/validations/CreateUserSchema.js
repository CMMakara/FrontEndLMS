export const validateCreateUser = (data, allowedRoles = [1, 2, 3]) => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  // Full Name
  if (!data.full_name?.trim()) {
    errors.full_name = "Full name is required";
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = "Full name must be at least 2 characters";
  }

  // Username
  if (!data.username?.trim()) {
    errors.username = "Username is required";
  } else {
    const username = data.username.trim();

    if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!usernameRegex.test(username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscore";
    }
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = "Invalid email format";
  }

  // Password
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

  // Role validation (IMPORTANT PART)
  if (data.role_id === undefined || data.role_id === null || data.role_id === "") {
    errors.role_id = "Role is required";
  } else if (!allowedRoles.includes(Number(data.role_id))) {
    errors.role_id = "You are not allowed to assign this role";
  }

  return errors;
};