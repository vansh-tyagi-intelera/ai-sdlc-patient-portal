import { validateRegistrationForm } from "../../../../../mobile/src/features/auth/register-validation";

describe("Registration form validation — DOB required", () => {
  const base = {
    firstName: "John",
    email: "john@example.com",
    password: "Password1!",
    confirmPassword: "Password1!",
  };

  it("returns DOB required error when dob is null", () => {
    const result = validateRegistrationForm({ ...base, dob: null });
    expect(result).toBe("Date of birth is required.");
  });

  it("returns null when dob is provided and all fields valid", () => {
    const result = validateRegistrationForm({ ...base, dob: new Date(2000, 5, 15) });
    expect(result).toBeNull();
  });

  it("returns generic required-fields error when firstName is empty and dob is null", () => {
    const result = validateRegistrationForm({ ...base, firstName: "", dob: null });
    expect(result).toBe("Please fill in all required fields.");
  });

  it("does not include DOB error when dob is provided but password is short", () => {
    const result = validateRegistrationForm({ ...base, dob: new Date(2000, 5, 15), password: "short" });
    expect(result).not.toBe("Date of birth is required.");
    expect(result).toBeTruthy();
  });
});
