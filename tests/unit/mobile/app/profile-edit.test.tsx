import { render, screen } from "@testing-library/react-native";
import ProfileEditScreen from "../../../../mobile/app/profile-edit";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), back: jest.fn() },
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
    }),
}));

jest.mock("../../../../mobile/src/components/forms/text-field", () => ({
  TextField: ({ label, value }: any) => {
    const { Text } = require("react-native");
    return <Text>{label}: {value}</Text>;
  },
}));

describe("Profile Edit screen — DOB locked field", () => {
  it("renders the Date of Birth field label", () => {
    render(<ProfileEditScreen />);
    expect(screen.getByText("Date of Birth")).toBeTruthy();
  });

  it("displays the dateOfBirth value from account", () => {
    render(<ProfileEditScreen />);
    expect(screen.getByText("06-15-1990")).toBeTruthy();
  });

  it("shows the hint that DOB cannot be changed", () => {
    render(<ProfileEditScreen />);
    expect(screen.getByText("Date of birth cannot be changed.")).toBeTruthy();
  });
});
