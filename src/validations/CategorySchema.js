
export const validateCategory = (data) => {
  const errors = {};

  if (!data.category_name || !data.category_name.trim()) {
    errors.category_name = "Category name is required";
  } else if (data.category_name.length < 3) {
    errors.category_name = "Minimum 2 characters required";
  }

  return errors;
};