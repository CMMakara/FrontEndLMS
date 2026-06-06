export const validatePublisher = (data) => {
  const errors = {};

  const publisher_name = data.publisher_name?.trim();
  const phone = data.phone?.trim();
  const address = data.address?.trim();

  // Publisher Name validation
  if (!publisher_name) {
    errors.publisher_name = "Publisher name is required";
  } else if (publisher_name.length < 2) {
    errors.publisher_name = "Minimum 2 characters required";
  } else if (publisher_name.length > 100) {
    errors.publisher_name = "Maximum 100 characters allowed";
  }

  // Phone validation
  if (!phone) {
    errors.phone = "Phone is required";
  } else if (!/^\+?[0-9\s\-]{7,20}$/.test(phone)) {
    errors.phone = "Invalid phone number format";
  }

  // Address validation
  if (!address) {
    errors.address = "Address is required";
  } else if (address.length < 5) {
    errors.address = "Minimum 5 characters required";
  } else if (address.length > 255) {
    errors.address = "Maximum 255 characters allowed";
  }

  return errors;
};