import React from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImage from "../assets/ai.gif";
import userImage from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

function Home() {
  const { serverURL, setUserData, getGeminiRespone } =
    React.useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = React.useState(false);
  const [ham, setHam] = React.useState(false);

  const [userText, setUserText] = React.useState("");
  const [aiText, setAiText] = React.useState("");
  const isRecognizingRef = React.useRef(false);

  const isSpeakingRef = React.useRef(false);
  const recognitionRef = React.useRef(null);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    console.log("serverURL", serverURL);
    try {
      let result = await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(result.data.message);
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error.response.data);
      // setErr(error.response.data.message);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        // setListening(true);
      } catch (err) {
        if (!err.message.includes("start")) {
          console.error("Recognition  error: ", err);
        }
      }
    }
  };
  const speaks = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const voices = window.speechSynthesis.getVoices();

    let hindiVoice = voices.find((v) => v.lang == "hi-IN");

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speaks(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }

    if (type === "instagram_open") {
      window.open("https://www.instagram.com", "_blank");
    }

    if (type === "facebook_open") {
      window.open("https://www.facebook.com", "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
  };

  React.useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // listen once
    recognition.lang = "en-US"; // set language
    recognition.interimResults = false; // 👈 only final results, not partial
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to Start ");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error("Start error:", e);
          }
        }
      }
    }, 1000);

    // const safeRecognition = () => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     try {
    //       recognition.start(); // Start listening
    //       console.log("Recognition requested to Start ");
    //     } catch (err) {
    //       if (err.name !== "InvalidStateError") {
    //         console.error("Start error:", err);
    //       }
    //     }
    //   }
    // };

    recognition.onstart = () => {
      console.log("Recognition started ");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition end ");
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start(); // Start listening
              console.log("Recognition restared ");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error("error:", e);
              }
            }
          }
        }, 1000);
      }

      // if (!isSpeakingRef.current) {
      //   setTimeout(() => {
      //     safeRecognition();
      //   }, 1000);
      // }
    };
    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start(); // Start listening
              console.log("Recognition restared after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error("error:", e);
              }
            }
          }
        }, 1000);

        // setTimeout(() => {
        //   safeRecognition();
        // }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("You transcript:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiRespone(transcript);
        console.log("data getGeminiRespone--> ", data);
        if (!data) {
          setAiText("Something went wrong. Please try again.");
          return;
        }
        // speaks(data.response);
        setAiText(data?.response);
        handleCommand(data);
        setUserText("");
      }
    };
    // recognition.start(); // Start listening
    // const fallback = setInterval(() => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     safeRecognition();
    //   }
    // }, 10000);
    // safeRecognition();

    // window.speechSynthesis.onvoiceschanged = () => {
      const greeting = new SpeechSynthesisUtterance(
        `Hello ${userData.name}, what can I Help you with ?`
      );

      // greeting.lang = "hi-IN";
      // greeting.onend = () => {
      //   startTimeout();
      // };
      window.speechSynthesis.speak(greeting);
    // };

    return () => {
      isMounted = false;
      clearInterval(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  const { userData } = React.useContext(userDataContext);
  return (
    <>
      <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#2b2b75] flex justify-center items-center flex-col overflow-hidden">
        <CgMenuRight
          onClick={() => setHam(true)}
          className="lg:hidden  text-[white] absolute 
        top-[30px] right-[15px] w-[25px] h-[25px]"
        />
        <div
          className={`top-0 absolute w-full lg:hidden h-screen bg-[#0000002f] 
        backdrop-blur-lg p-[10px] flex flex-col gap-[20px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
        >
          <IoClose
            onClick={() => setHam(false)}
            className="lg:hidden items-end text-[white] absolute 
        top-[30px] right-[15px] w-[30px] h-[30px]"
          />
          <button
            onClick={handleLogOut}
            className="min-w-[110px] items-start h-[60px] mt-[15px] bg-white 
           text-black font-semibold rounded-full text-[19px]"
          >
            Log out
          </button>
          <button
            onClick={() => navigate("/customize")}
            className="min-w-[110px]  h-[60px] mt-[15px] bg-white p-2
           text-black font-semibold rounded-full text-[19px] "
          >
            Customize Your Assistant
          </button>
          <div className=" w-full h-[2px] bg-gray-400 ">
            <h1 className="text-white font-semibold text-[20px] m-1 ">
              History
            </h1>
            <div
              className="w-full h-[400px] overflow-x-auto
             flex flex-col gap-[20px]"
            >
              {/* {userData.history?.map((his) => (
                <span className="text-white text-[18px]">{his} </span>
              ))} */}
              {userData.history?.map((his, index) => (
                <span key={index} className="text-white text-[18px]">
                  {his}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogOut}
          className="min-w-[150px] self-center h-[60px] mt-[30px] bg-white 
     text-black font-semibold rounded-full text-[19px] absolute hidden lg:block top-[20px] right-[20px]"
        >
          Log out
        </button>

        <button
          onClick={() => navigate("/customize")}
          className="min-w-[150px] self-center h-[60px] mt-[30px] bg-white p-2
     text-black font-semibold rounded-full text-[19px] absolute hidden lg:block top-[100px] right-[20px]"
        >
          Customize Your Assistant
        </button>

        <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden shadow-lg rounded-4xl">
          <img src={userData?.assistantImage} className="h-full object-cover" />
        </div>
        <h1 className="text-white text-[18px] ">
          I'm {userData.assistantName}
        </h1>
        {!aiText && <img src={userImage} className="w-[150px]" />}

        {aiText && <img src={aiImage} className="w-[150px]" />}

        <h1 className="text-white text-[18px] font-semibold text-wrap">
          {userText ? userText : aiText ? aiText : null}
        </h1>
      </div>
    </>
  );
}
export default Home;
