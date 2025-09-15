import React from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { serverURL, userData, setUserData, backendImage, selectedImage } =
    React.useContext(userDataContext);
  const [assistantName, setAssistantName] = React.useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverURL}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      console.log("handleUpdateAssistant-->", result.data);
      setUserData(result.data);
      setLoading(false);
      navigate('/')
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };
  return (
    <>
      <div
        className="w-full h-[100vh] bg-gradient-to-t from-black
       to-[#2b2b75] flex justify-center items-center flex-col relative"
      >
        <IoMdArrowRoundBack
          onClick={() => navigate("/customize")}
          className="absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]  "
        />
        <h1 className="text-white text-[30px] mb-4 ">
          Select your <span className="text-blue-300">Assistant Name</span>
        </h1>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="eg. shifra"
          className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent
           text-white text-[18px] px-[20px] py-[10px] placeholder-gray-300 rounded-full"
          required
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />
        {/* <button
          className="min-w-[150px] self-center cursor-pointer h-[60px] mt-[30px] bg-white
           text-black font-semibold rounded-full text-[19px]"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button> */}
        {assistantName && (
          <button
            disabled={loading}
            className="min-w-[300px] self-center cursor-pointer h-[60px] mt-[30px] bg-white
           text-black font-semibold rounded-full text-[19px]"
            onClick={() => handleUpdateAssistant()}
          >
            {loading ? "loading.." : "Finally Create Your Assistant"}
          </button>
        )}
      </div>
    </>
  );
}
export default Customize2;
