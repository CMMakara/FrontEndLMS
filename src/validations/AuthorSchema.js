export const validateAuthor = (data) => {
  const errors = {};

  const name = data.author_name?.trim();
  const bio = data.biography?.trim();

  // Author name validation
  if (!name) {
    errors.author_name = "Author name is required";
  } else if (name.length < 2) {
    errors.author_name = "Minimum 2 characters required";
  } else if (name.length > 100) {
    errors.author_name = "Maximum 100 characters allowed";
  }

  // Biography validation
  if (!bio) {
    errors.biography = "Biography is required";
  } else if (bio.length < 5) {
    errors.biography = "Minimum 5 characters required";
  } else if (bio.length > 1000) {
    errors.biography = "Maximum 1000 characters allowed";
  }

  return errors;
};