import React from "react";

function DeleteButton({ onClick }) {
  return (
    <button className="btn btn-danger" onClick={onClick}>
      Delete
    </button>
  );
}

export default DeleteButton;
