import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { formatDobForDisplay } from "../../features/auth/dob-validation";
import { colors, radii, spacing, typography } from "../../theme";

type DatePickerFieldProps = {
  error?: string;
  label: string;
  maximumDate?: Date;
  minimumDate?: Date;
  onChange: (date: Date) => void;
  value: Date | null;
};

export function DatePickerField({
  error,
  label,
  maximumDate,
  minimumDate,
  onChange,
  value,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (_event: any, selected?: Date) => {
    if (Platform.OS === "android") {
      setOpen(false);
    }
    if (selected) {
      onChange(selected);
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityHint="Opens a calendar to select your date of birth"
        accessibilityLabel="Date of birth"
        accessibilityRole="button"
        hitSlop={4}
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <MaterialIcons
          color={colors.onSurfaceVariant}
          name="calendar-today"
          size={20}
          style={styles.icon}
        />
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value ? formatDobForDisplay(value) : "MM-DD-YYYY"}
        </Text>
      </Pressable>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      {open ? (
        <DateTimePicker
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode="date"
          onChange={handleChange}
          testID="date-picker"
          value={value ?? new Date()}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.onSurfaceVariant,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  field: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: `${colors.outlineVariant}33`,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    height: 52,
    minHeight: 44,
  },
  fieldError: {
    borderColor: colors.error,
  },
  icon: {
    marginLeft: spacing.md,
  },
  valueText: {
    color: colors.onSurface,
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingHorizontal: spacing.md,
  },
  placeholder: {
    color: colors.outline,
  },
  error: {
    color: colors.error,
    fontSize: typography.caption.fontSize,
    marginLeft: 4,
    marginTop: spacing.xs,
  },
});
