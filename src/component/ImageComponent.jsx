import React from "react";

const ImageComponent = ({ src, alt, width = "100%", height = "auto" }) => {
  return <img src={src} alt={alt} width={width} height={height} className="img-fluid" />;
};

export default ImageComponent;
