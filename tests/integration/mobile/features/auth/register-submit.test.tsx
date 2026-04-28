import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../../../../../mobile/app/register";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), back: jest.fn() },
}));

const mockApiRegister = jest.fn();

jest.mock("../../../../../mobile/src/services/auth-api", () => ({
  apiRegister: (...args: any[]) => mockApiRegister(...args),
}));

jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ onChange, testID }: any) => (
      <View
        testID={testID ?? "date-picker"}
        onTouchEnd={() => onChange({ type: "set" }, new Date(2000, 5, 15))}
      />
    ),
  };
});

describe("Register screen — submit blocked when DOB empty", () => {
  beforeEach(() => {
    mockApiRegister.mockClear();
  });

  it("does not call apiRegister when DOB is empty", async () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("John"), "John");
    fireEvent.changeText(screen.getByPlaceholderText("Doe"), "Doe");
    fireEvent.changeText(screen.getByPlaceholderText("name@example.com"), "john@example.com");
    fireEvent.changeText(screen.getAllByPlaceholderText("••••••••")[0], "Password1!");
    fireEvent.changeText(screen.getAllByPlaceholderText("••••••••")[1], "Password1!");

    fireEvent.press(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(mockApiRegister).not.toHaveBeenCalled();
    });
  });

  it("shows DOB required error message when DOB is empty on submit", async () => {
    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("John"), "John");
    fireEvent.changeText(screen.getByPlaceholderText("Doe"), "Doe");
    fireEvent.changeText(screen.getByPlaceholderText("name@example.com"), "john@example.com");
    fireEvent.changeText(screen.getAllByPlaceholderText("••••••••")[0], "Password1!");
    fireEvent.changeText(screen.getAllByPlaceholderText("••••••••")[1], "Password1!");

    fireEvent.press(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(screen.getByText("Date of birth is required.")).toBeTruthy();
    });
  });
});
