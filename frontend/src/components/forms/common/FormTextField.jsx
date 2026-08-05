import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const FormTextField = ({
  name,
  control,
  label,
  required = false,
  type = "text",
  disabled = false,
  multiline = false,
  rows = 1,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          required={required}
          disabled={disabled}
          multiline={multiline}
          rows={rows}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? ""}
          {...props}
        />
      )}
    />
  );
};

export default FormTextField;