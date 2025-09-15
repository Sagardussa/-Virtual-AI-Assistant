import React from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const context = React.useContext(userDataContext);
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      let result = await axios.post(
        `${context.serverURL}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      context.setUserData(result.data);
      setLoading(false);
      navigate('/customize')
    } catch (error) {
      setLoading(false);
      context.setUserData(null);
      console.log(error.response.data);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center item-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%]h-[570px] max-w-[500px] bg-[#00000051] 
      backdrop-blur shadow-lg shadow-black flex flex-col  justify-center gap-[20px]"
      >
        <h1 className="text-white text-[30px] font-semibold">
          Register to
          <span className="text-blue-400"> Virtual AI Assistant</span>
        </h1>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Your Name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent
           text-white text-[18px] px-[20px] py-[10px] placeholder-gray-300 rounded-full"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent
           text-white text-[18px] px-[20px] py-[10px] placeholder-gray-300 rounded-full"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div
          className="w-full h-[60px] border-2 border-white bg-transparent
           text-white rounded-full text-[18px] relative"
        >
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="password"
            className="w-full h-full outline-none  bg-transparent
             text-white text-[18px] px-[20px] py-[10px] placeholder-gray-300 rounded-full "
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-[18px] cursor-pointer right-[20px] text-[white] h-[25px] w-[25px] "
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className="absolute top-[18px] cursor-pointer right-[20px] text-[white] h-[25px] w-[25px] "
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {err.length > 0 && <p className="text-red-300 text-[17px]">*{err}</p>}

        <button
          disabled={loading}
          className="min-w-[150px] self-center h-[60px] mt-[30px] bg-white
           text-black font-semibold rounded-full text-[19px]"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <p
          onClick={() => navigate("/signIn")}
          className="text-white self-center cursor-pointer text-[18px]"
        >
          Already Have an account ?
          <span className="text-blue-400"> Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
