import React, { useState } from "react";

const Card = ({ value, flipped, onClick }) => {
  return (
    <div className={`card ${flipped ? "flipped" : ""}`} onClick={onClick}>
      {flipped ? value : "?"}
    </div>
  );
};

export default Card;
