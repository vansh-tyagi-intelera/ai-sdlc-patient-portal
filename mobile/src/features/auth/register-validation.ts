type RegistrationFields = {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: Date | null;
};

export function validateRegistrationForm(fields: RegistrationFields): string | null {
  const { firstName, email, password, confirmPassword, dob } = fields;

  if (!firstName.trim() || !email.trim() || !password || !confirmPassword) {
    return "Please fill in all required fields.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*).";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  if (!dob) {
    return "Date of birth is required.";
  }
  return null;
}
