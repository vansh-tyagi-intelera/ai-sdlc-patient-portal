import { isValidDob, formatDobForDisplay, formatDobForApi } from "../../../../../mobile/src/features/auth/dob-validation";

describe("DOB validation — boundary rules", () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const minValid = new Date(today);
  minValid.setFullYear(minValid.getFullYear() - 200);

  const tooOld = new Date(minValid);
  tooOld.setDate(tooOld.getDate() - 1);

  it("today is invalid (future / same-day boundary)", () => {
    expect(isValidDob(today)).toBe(false);
  });

  it("yesterday is valid", () => {
    expect(isValidDob(yesterday)).toBe(true);
  });

  it("200 years ago exactly is valid", () => {
    expect(isValidDob(minValid)).toBe(true);
  });

  it("200 years and 1 day ago is invalid", () => {
    expect(isValidDob(tooOld)).toBe(false);
  });

  it("Feb 29 on a leap year is valid", () => {
    const leapDay = new Date(2000, 1, 29);
    expect(isValidDob(leapDay)).toBe(true);
  });

  it("a future date is invalid", () => {
    const future = new Date(today);
    future.setDate(future.getDate() + 1);
    expect(isValidDob(future)).toBe(false);
  });
});

describe("DOB display format", () => {
  it("formats a date as MM-DD-YYYY", () => {
    const date = new Date(2000, 5, 15);
    expect(formatDobForDisplay(date)).toBe("06-15-2000");
  });

  it("pads single-digit month and day", () => {
    const date = new Date(1990, 0, 5);
    expect(formatDobForDisplay(date)).toBe("01-05-1990");
  });
});

describe("DOB API format", () => {
  it("formats a date as MM-DD-YYYY", () => {
    const date = new Date(2000, 5, 15);
    expect(formatDobForApi(date)).toBe("06-15-2000");
  });

  it("pads single-digit month and day", () => {
    const date = new Date(1990, 0, 5);
    expect(formatDobForApi(date)).toBe("01-05-1990");
  });
});
