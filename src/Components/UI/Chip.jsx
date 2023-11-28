import React, { useState } from "react";

const Chip = ({ text, key, click }) => {
  const getRandomColor = () => {
    const colors = [
      "#FF5733",
      "#C70039",
      "#900C3F",
      "#581845",
      "#FFC300",
      "#DAF7A6",
      "#FF5733",
      "#C70039",
      "#900C3F",
      "#581845",
      "#FFC300",
      "#DAF7A6",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  const [chipColor, setChipColor] = useState(getRandomColor());

  const chipStyle = {
    backgroundColor: chipColor,
    padding: "0.5rem",
    borderRadius: "50px",
    color: "#fff",
    display: "inline-block",
    margin: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    border: "1px solid #fff",
    cursor: "pointer",
  };

  return (
    <div style={chipStyle} key={key} onClick={click}>
      {text}
    </div>
  );
};

export default Chip;
