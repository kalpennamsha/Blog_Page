import React from "react";

function FormInput({ name, label, value, onChange, required }) {
  return (
    <label>
      {label}:
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

export default FormInput;
