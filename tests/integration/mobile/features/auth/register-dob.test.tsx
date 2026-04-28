import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../../../../../mobile/app/register";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), back: jest.fn() },
}));

jest.mock("../../../../../mobile/src/services/auth-api", () => ({
  apiRegister: jest.fn().mockResolvedValue({
    userId: "u1",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "06-15-2000",
    message: "Registration successful",
  }),
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

describe("Register screen — DOB integration", () => {
  it("submits dateOfBirth in MM-DD-YYYY format when form is complete", async () => {
    const { apiRegister } = require("../../../../../mobile/src/services/auth-api");

    render(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("John"), "John");
    fireEvent.changeText(screen.getByPlaceholderText("Doe"), "Doe");
    fireEvent.changeText(screen.getByPlaceholderText("name@example.com"), "john@example.com");
    fireEvent.changeText(screen.getAllByPlaceholderText("••••••••")[0], "Password1!");
    fireEvent.changeText(screen.getAllByPlaceholderText("••••••••")[1], "Password1!");

    fireEvent.press(screen.getByLabelText("Date of birth"));
    fireEvent(screen.getByTestId("date-picker"), "touchEnd");

    fireEvent.press(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(apiRegister).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "Password1!",
        "Password1!",
        "06-15-2000",
      );
    });
  });
});
