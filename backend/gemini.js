import axios from "axios";
const geminiRespone = async (command, assiatantName, userName) => {
    const prompts = `you are virtual assiatant named ${assiatantName} created by 
    ${userName}.
    you are not Google. you will now behave like a voice-enabled assiatant.
    
    Your task is to understand the user's natural language input and respone with a JSON 
    object like this: 
    
    
    {
        "type": "general" | "google_search" | "youtube_search" | "youtube_play" | 
        "get-time" | "get-date" | "get-day" | "get-month" | "calculator_open" |
        "instagram_open" | "facebook_open" | "weather_show",

        "userInput": "<original user input>" {only remove your name from userinput if
        exists) and agar kisi ne google ya youtube pe kuch search karne ko bola hai to 
        userInput me only bo search baala text jaye,

        "response": "<a short spoken response to read out loud to the user>"
    }

        Instructions:
        "type": determine the intent of the user.
        "userinput": original sentence the user spoke.
        "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's 
        what I found", "Today is Tuesday", etc.

        Type meanings:
        - "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
        - "google_search": if user wants to search something on Google
        - "youtube_search": if user wants to search something on YouTube.
        - "youtube_play": if user wants to directly play a video or song.
        - "calculator_open": if user wants to open a calculator
        - "instagram_open" if user wants to open instagram
        - "facebook_open": if user wants to open facebook.
        - "weather_show": if user wants to know weather
        - "get-time": if user asks for current time.
        - "get-date": if user asks for today's date.
        - "get-day": if user asks what day it is.
        - "get-month": if user asks for the current month.

        Important:
        - Use ${userName} agar koi puche tume kisne banaya
        - Only respond with the JSON object, nothing else.

        now your userInput ${command}
        `;

    try {
        const apiUrl = process.env.GEMINI_API_URL;
        if (!apiUrl) {
            throw new Error("GEMINI_API_URL is not set in environment");
        }

        const response = await axios.post(
            apiUrl,
            {
                contents: [{ parts: [{ text: prompts }] }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (
            !response.data?.candidates?.[0]?.content?.parts?.[0]?.text
        ) {
            throw new Error("Invalid Gemini response format");
        }
        // ✅ Safely access response
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;


        // return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("geminiRespone error:", error.message);
        return null; // important: return null so caller can handle it
    }
};

// aur agar koi aisa question puchta hai jiska answer tume pata hai 
// usko bhi general ki category me rakho bas short answer dena

export default geminiRespone;
