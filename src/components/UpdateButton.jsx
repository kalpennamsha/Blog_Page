import React from "react";

function UpdateButton({ onClick }) {
  return (
    <button className="btn btn-success" onClick={onClick}>
      Update
    </button>
  );
}

export default UpdateButton;
