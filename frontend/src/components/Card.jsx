import React from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    // serverURL,
    // userData,
    // setUserData,
    // frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = React.useContext(userDataContext);
  return (
    <>
      <div
        className={`w-[80px] h-[140px] lg:w-[150px] lg:h-[250px] 
      bg-[#040433] border-[#0000ff69] rounded-2xl 
      overflow-hidden hover:shadow-2xl shadow-blue-950 cursor-pointer border-4 hover:border-white 
      ${
        selectedImage == image
          ? "shadow-2xl shadow-blue-950 cursor-pointer border-4 border-white"
          : null
      }`}
        onClick={() => {
          setSelectedImage(image);
          setBackendImage(null);
          setFrontendImage(null);
        }}
      >
        <img src={image} className="h-full object-cover" />
      </div>
    </>
  );
}
export default Card;
