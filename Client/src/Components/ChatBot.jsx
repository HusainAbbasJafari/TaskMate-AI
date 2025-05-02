import React, { useState, useRef, useEffect } from 'react';
import { BsRobot } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa6";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { BsArrowsAngleContract } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import { RiMenu4Fill } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import ChatContent from './ChatContent'; // Import your chat content component
import { fetchAIChatBot } from '../api/aiApi';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatContent, setChatContent] = useState([]); // State to manage chat content
  
  const [showChat, setShowChat] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [greet, setGreet] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const chatRef = useRef(null);
  const iconRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null); // Ref to store the SpeechRecognition instance
  const isListeningRef = useRef(false); // Flag to avoid multiple recognition calls

  // Detect outside click to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowChat(false);
        setFullScreen(false);
      }
    };

    if (showChat) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChat, fullScreen]);

  let currentUtterance = null; // Keep track of the current utterance
  const speak = (text) => {
    if (currentUtterance) {
      speechSynthesis.cancel(); // Stop previous speech
    }

    currentUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(currentUtterance);

    currentUtterance.onend = () => {
      currentUtterance = null; // Clear the reference once the speech is done
    };
  };


  const stopSpeaking = () => {
    if (currentUtterance) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      currentUtterance = null;
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setFullScreen(false);
    setGreet(false);
    stopSpeaking(); // Stop speech synthesis if it's active

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop listening for wake word when the chat is closed
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log('Voice recognition stopped.');
    }

    // unComment to activate the wake word detection
    listenForWakeWord();
  };

  const handleOpenChat = () => {
    // Stop recognition when chat is opened
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log('Voice recognition stopped when chat opened.');
    }

    if (showChat) {
      handleCloseChat(); // Close if already open
      return;
    }
    setShowChat(true);
    setFullScreen(false);

    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio played successfully.');
          })
          .catch((error) => {
            console.log('Audio play failed, using speech synthesis.', error);
            speak("Hi, I am Jayf, your assistant. How can I help you?");
          });
      }
    } else {
      speak("Hi, I am Jayf, your assistant. How can I help you?");
    }
  };



   // unComment to activate the wake word detection

  const listenForWakeWord = () => {
    // Prevent multiple calls for recognition if already listening
    if (isListeningRef.current) return;
    isListeningRef.current = true; // Set the flag to true when listening starts

    // Don't listen if chat is open
    if (showChat) {
      console.log('Chat is open, not listening for wake word.');
      return;
    }

    // Check for browser support and handle the correct SpeechRecognition constructor
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) {
      console.error("Speech Recognition is not supported in this browser.");
      return;
    }

    const speechRecognition = new recognition();
    recognitionRef.current = speechRecognition; // Store the instance in the ref
    speechRecognition.lang = 'en-US'; // Set language to English
    speechRecognition.interimResults = false; // Only final results

    speechRecognition.onstart = () => {
      console.log('Voice recognition started.');
    };

    speechRecognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Voice Command:', command);

      if (
        command === "hey jayf" || 
        command === "hey j" || 
        command === "hey j a y f" || 
        command === "hey jeff" || 
        command === "hey jef"||
        command === "hey hero"
      ) {
        console.log('Opening chat...');
        handleOpenChat(); // Open chat when wake word is detected
        speechRecognition.stop(); // Stop listening for wake word after opening chat
      }
    };

    speechRecognition.onerror = (error) => {
      console.log('Speech recognition error:', error);
    };

    speechRecognition.onend = () => {
      console.log('Voice recognition ended.');
      isListeningRef.current = false; // Reset the flag when recognition ends

      if (!showChat) {
        listenForWakeWord(); // Restart the recognition after it ends if chat is still closed
      } else {
        console.log('Recognition stopped because the chat is open.');
      }
    };

    speechRecognition.start(); // Start listening for voice commands
  };

  
   // unComment to activate the wake word detection

  useEffect(() => {
    if (!showChat) {
      listenForWakeWord(); // Start listening for wake word when chat is closed
    }

    // Cleanup on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        console.log('Voice recognition stopped on unmount.');
      }
    };
  }, [showChat]); // Re-run the effect when `showChat` state changes


  const handleGreet = () => {
    setGreet(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
  
    const userMessage = { type: "user", text: inputValue };
    const loadingMessage = { type: "bot", text: "..." };
  
    // Add user message and loading indicator
    setChatContent((prev) => [...prev, userMessage, loadingMessage]);
    const userInput = inputValue;
    setInputValue("");
  
    try {
      // Build chat history in { role, message } format
      const chatHistory = [...chatContent, userMessage].map((msg) => ({
        role: msg.type === "user" ? "USER" : "CHATBOT",
        message: msg.text,
      }));
  
      const response = await fetchAIChatBot(userInput, chatHistory);
  
      // Replace last "loading" message with actual response
      setChatContent((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: "bot", text: response.text };
        return updated;
      });
  
      // Optional speech
      // speak(response.text);
    } catch (err) {
      console.error("Error sending message:", err);
      setChatContent((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: "bot", text: "Something went wrong. Please try again." };
        return updated;
      });
    }
  
    setIsMenuOpen(false);
  };
  

  return (

    
    <div className='chatbot '>

    
      {/* Chat Box */}
      <div
        ref={chatRef}
        className={`${showChat ? "chat-box-open" : "chat-box-close"} ${fullScreen ? "full-screen" : ""} chat-box `}
      >

      

       <div className={`${!fullScreen ?"rounded-top-3 height-small":"height-large fs-5" } position-absolute chat-box-header z-3 d-flex justify-content-between align-items-center bg-dark  w-100`}>
        

        {/* menu */}
        <div>
      
        <RiMenu4Fill onClick={()=>setIsMenuOpen(!isMenuOpen)}/>
        </div>
        
        {/* Options */}
        <ul style={{
    maxHeight: isMenuOpen ? "500px" : "0px", 
    overflowY: "hidden",
    transition: "max-height 0.3s ease-in-out"
  }} className="position-absolute overflow-y-hidden chatbot-options  list-unstyled rounded-bottom">
         <li className=" border-bottom" >hellddo</li>
         <li className=" border-bottom " >hello</li>
         <li className=" border-bottom " >hello moreeeeeedee</li>
        
        </ul>

        {/* title */}
        <div className='d-flex align-items-center gap-2 text-info chatbot-title '>
          <span className='text-white' > Jayfie </span>
          <BsStars  />
        </div>
        
        
        <div className='d-flex align-items-center gap-2'>
          {/* fullscreen */}
          {!fullScreen? <BsArrowsAngleExpand onClick={()=>setFullScreen(true)}/> :  <BsArrowsAngleContract onClick={()=>setFullScreen(false)} />}
        
       
        {/* close */}
        <IoMdExit onClick={handleCloseChat} />
     


        
        </div>


       </div>
        
       <div  style={{padding: !fullScreen ? "45px  20px 90px" : "75px 100px 120px "}} className=" overflow-y-auto chat-box-content   rounded h-100">
            <ChatContent chat={chatContent} userInput = {inputValue}/> {/* Replace with your chat content component */}
       </div>

          {/* chatInput */}

     <div className={` ${fullScreen ? "p-3" :"p-2" } chatbot-input position-absolute  bg-light rounded-pill d-flex justify-content-between align-items-center`}>

<input
  type="search"
  className="form-control border-0 "
  placeholder="Type your message..."
  onChange={(e) => setInputValue(e.target.value)}
  value={inputValue}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSendMessage(); // Call the send message function on Enter key press
    }
  }}
/>
<button onClick={handleSendMessage} style={{width:"40px",height:"40px",}} className="  bg-dark rounded-circle d-flex justify-content-center align-items-center w-5 h-5"> <FaArrowUp  className='text-white ' /></button>


</div>

      </div>

   


      {/* Chatbot Icon */}
      <div
        ref={iconRef}
        className="chatbot-icon rotate-infinte rounded-circle d-flex justify-content-center align-items-center bg-warning h-5 w-5 shadow"
      >
        <BsRobot
          onMouseEnter={handleGreet}
          onMouseLeave={() => setGreet(false)}
          onClick={handleOpenChat} // Open the chat and play audio
          size={30}
        />
      </div>

      {/* Audio element for the greeting sound */}
      <audio ref={audioRef} src="/myvoice/JayfGreet.mp3" preload="auto" />

      {/* Greeting Text */}
      {greet && !showChat && !fullScreen && (
        <div className="chatbox-hello-text">
          Hi, I am your assistant, how can I help you?
        </div>
      )}
  </div>


  );
};

export default ChatBot;
