export const validateFields = (fields, formData) => {
  for (const field of fields) {
    const value = formData[field.name];

    if (typeof value === "string" && value.trim() === "") {
      return {
        isValid: false,
        message: `${field.label} is required.`,
      };
    } else if (value === undefined || value === null) {
      return {
        isValid: false,
        message: `${field.label} is required.`,
      };
    }
  }

  return { isValid: true };
};
