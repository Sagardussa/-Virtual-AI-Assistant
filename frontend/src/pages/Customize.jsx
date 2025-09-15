import React from "react";
import { userDataContext } from "../context/UserContext";
import Card from "../components/card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
function Customize() {
  // const [frontendImage, setFrontendImage] = React.useState(null);
  // const [backendImage, setBackendImage] = React.useState(null);

  const inputImage = React.useRef(null);

  const {
    // serverURL,
    // userData,
    // setUserData,
    frontendImage,
    setFrontendImage,
    // backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = React.useContext(userDataContext);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <>
      <div
        className="w-full h-[100vh] bg-gradient-to-t from-black
       to-[#2b2b75] flex justify-center items-center flex-col relative"
      >
         <IoMdArrowRoundBack
                  onClick={() => navigate("/")}
                  className="absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]  "
                />
        <h1 className="text-white text-[30px] mb-4 ">
          Select your <span className="text-blue-300">Assistant Image</span>
        </h1>
        <div
          className="w-[90%] max-w-[900px] flex justify-center 
        items-center flex-wrap gap-[15px]"
        >
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={image7} />
          <div
            className={` w-[80px] h-[140px] lg:w-[150px] lg:h-[250px]  flex justify-center items-center
      bg-[#040433] border-[#0000ff69] rounded-2xl 
      overflow-hidden hover:shadow-2xl shadow-blue-950 cursor-pointer border-4 hover:border-white
       ${
         selectedImage == "input"
           ? "shadow-2xl shadow-blue-950 cursor-pointer border-4 border-white"
           : null
       }`}
            onClick={() => {
              inputImage.current?.click();
              setSelectedImage("input");
            }}
          >
            {!frontendImage && (
              <RiImageAddLine className="text-white w-[25px] h-[25px]" />
            )}

            {frontendImage && (
              <img src={frontendImage} className="h-full object-cover" />
            )}

            {/* <img src={image} alt="" srcset="" className="h-full object-cover" /> */}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            ref={inputImage}
            hidden
          />
        </div>
        {selectedImage && (
          <button
            className="min-w-[150px] self-center cursor-pointer h-[60px] mt-[30px] bg-white
           text-black font-semibold rounded-full text-[19px]"
            onClick={() => navigate("/customize2")}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}
export default Customize;
