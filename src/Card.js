import React from "react";

const Card = ({ key, name, image }) => {
  return <img id={key} src={image} alt={name} />;
};

export default Card;
