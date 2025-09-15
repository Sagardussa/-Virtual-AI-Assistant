import axios from "axios";
import React from "react";

export const userDataContext = React.createContext(null);

function UserContext({ children }) {
  const serverURL = "http://localhost:8000";
  const [userData, setUserData] = React.useState(null);
  const [frontendImage, setFrontendImage] = React.useState(null);
  const [backendImage, setBackendImage] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const getGeminiRespone = async (command) => {
    try {
      const result = await axios.post(
        `${serverURL}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  const value = {
    serverURL,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiRespone,
  };
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
