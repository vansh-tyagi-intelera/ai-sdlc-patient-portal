import { render, screen } from "@testing-library/react-native";
import ProfileScreen from "../../../../mobile/app/profile";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), back: jest.fn(), push: jest.fn() },
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

jest.mock("../../../../mobile/src/store/auth-store", () => ({
  useAuthStore: (selector: any) =>
    selector({
      account: {
        id: "u1",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        displayName: "Jane Doe",
        role: "patient",
        dateOfBirth: "06-15-1990",
      },
      signOut: jest.fn(),
    }),
}));

jest.mock("../../../../mobile/src/components/layouts/bottom-nav", () => ({
  BottomNav: () => null,
}));

describe("Profile screen — DOB display", () => {
  it("shows the Date of Birth label in the personal info card", () => {
    render(<ProfileScreen />);
    expect(screen.getByText("Date of Birth")).toBeTruthy();
  });

  it("displays dateOfBirth value from account in MM-DD-YYYY format", () => {
    render(<ProfileScreen />);
    expect(screen.getByText("06-15-1990")).toBeTruthy();
  });

  it("shows '—' when account has no dateOfBirth", () => {
    const { useAuthStore } = require("../../../../mobile/src/store/auth-store");
    useAuthStore.mockImplementation((selector: any) =>
      selector({
        account: {
          id: "u1",
          email: "jane@example.com",
          firstName: "Jane",
          lastName: "Doe",
          displayName: "Jane Doe",
          role: "patient",
        },
        signOut: jest.fn(),
      }),
    );
    render(<ProfileScreen />);
    expect(screen.getByText("—")).toBeTruthy();
  });
});
