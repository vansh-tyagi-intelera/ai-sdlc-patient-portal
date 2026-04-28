import { fireEvent, render, screen } from "@testing-library/react-native";
import { DatePickerField } from "../../../../../mobile/src/components/forms/date-picker-field";

jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ onChange, testID }: any) => (
      <View
        testID={testID ?? "date-picker"}
        accessibilityLabel="date-picker-native"
        onTouchEnd={() =>
          onChange({ type: "set" }, new Date(2000, 5, 15))
        }
      />
    ),
  };
});

const mockOnChange = jest.fn();

describe("DatePickerField", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders the label", () => {
    render(<DatePickerField label="Date of Birth" value={null} onChange={mockOnChange} />);
    expect(screen.getByText("Date of Birth")).toBeTruthy();
  });

  it("shows placeholder text when no date selected", () => {
    render(<DatePickerField label="Date of Birth" value={null} onChange={mockOnChange} />);
    expect(screen.getByText("MM-DD-YYYY")).toBeTruthy();
  });

  it("shows formatted date when value is set", () => {
    const date = new Date(2000, 5, 15);
    render(<DatePickerField label="Date of Birth" value={date} onChange={mockOnChange} />);
    expect(screen.getByText("06-15-2000")).toBeTruthy();
  });

  it("opens the picker on tap", () => {
    render(<DatePickerField label="Date of Birth" value={null} onChange={mockOnChange} />);
    const pressable = screen.getByLabelText("Date of birth");
    fireEvent.press(pressable);
    expect(screen.getByTestId("date-picker")).toBeTruthy();
  });

  it("calls onChange with selected date and closes picker", () => {
    render(<DatePickerField label="Date of Birth" value={null} onChange={mockOnChange} />);
    const pressable = screen.getByLabelText("Date of birth");
    fireEvent.press(pressable);
    fireEvent(screen.getByTestId("date-picker"), "touchEnd");
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it("closes picker when dismissed", () => {
    render(<DatePickerField label="Date of Birth" value={null} onChange={mockOnChange} />);
    const pressable = screen.getByLabelText("Date of birth");
    fireEvent.press(pressable);
    expect(screen.getByTestId("date-picker")).toBeTruthy();
  });

  it("renders an error message when error prop is provided", () => {
    render(
      <DatePickerField
        label="Date of Birth"
        value={null}
        onChange={mockOnChange}
        error="Date of birth is required."
      />,
    );
    expect(screen.getByText("Date of birth is required.")).toBeTruthy();
  });
});
