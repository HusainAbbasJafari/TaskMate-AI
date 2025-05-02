import React, { useState, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { IoMicOutline } from "react-icons/io5";

const SmartInput = ({
  value = "",
  onChange,
  onBlur,
  name,
  placeholder = "Type or Speak...",
  className,
  type,
  id,
}) => {
  const [isTabClicked, setIsTabClicked] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const latestInputRef = useRef(""); // Track the latest input value

  // const fetchAISuggestions = async (value) => {
  //   setSuggestion("");
  //   if (!value || !value.trim()) return;

  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/suggestions`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ input: value }),
  //     });

  //     if (!res.ok) {
  //       const errData = await res.json();
  //       throw new Error(errData.error || "Unknown backend error");
  //     }

  //     const data = await res.json().catch(() => {
  //       console.error("Invalid JSON response");
  //       alert("Error: Invalid JSON response from the server.");
  //       return { suggestions: [] };
  //     });

  //     const suggestions = (data.suggestions || []).filter(
  //       (s) =>
  //         !/^here are|^let me|^these suggestions/i.test(s.trim()) &&
  //         !/^[A-Z][a-z]+(?: [A-Z][a-z]+)*:/.test(s.trim())
  //     );
  //     console.log(suggestions, "suggestionsList");

  //     const normalize = (text) =>
  //       text.replace(/[^\w\s]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

  //     const originalWords = normalize(value).split(" ");
  //     let searchString = originalWords.join(" ");
  //     let match = null;

  //     while (searchString && !match) {
  //       match = suggestions.find(
  //         (s) =>
  //           normalize(s).startsWith(searchString) &&
  //           normalize(s) !== searchString
  //       );

  //       if (!match) {
  //         originalWords.pop();
  //         searchString = originalWords.join(" ");
  //       }
  //     }

  //     if (!match && suggestions.length > 0) {
  //       match = suggestions[0];
  //     }

  //     if (value === latestInputRef.current) {
  //       setSuggestion(match || "");
  //       console.log(suggestion,"suggestion")
  //       console.log(suggestion.slice(value.length),"suggestion slice")
  //     }
  //   } catch (err) {
  //     console.error("AI suggestion error:", err);
  //     alert(`Error: ${err.message}`);
  //     setSuggestion("");
  //   }
  // };
  const fetchAISuggestions = async (value) => {
    setSuggestion('');
  
  
    if (!value || !value.trim()) return;
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: value }),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Unknown backend error');
      }
  
      const data = await res.json().catch(() => {
        console.error('Invalid JSON response');
        alert('Error: Invalid JSON response from the server.');
        return { suggestions: [] };
      });
  
      console.log('Suggestions:', data.suggestions);
  
      const suggestions = (data.suggestions || []).filter(
        (s) =>
          !/^here are|^let me|^these suggestions/i.test(s.trim()) &&
          !/^[A-Z][a-z]+(?: [A-Z][a-z]+)*:/.test(s.trim())
      );
  
      const normalize = (text) =>
        text.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim().toLowerCase();
  
      const originalWords = normalize(value).split(' ');
      let searchString = originalWords.join(' ');
      let match = null;
  
     
      while (searchString && !match) {
        match = suggestions.find(
          (s) =>
            normalize(s).startsWith(searchString) &&
            normalize(s) !== searchString
        );
  
        if (!match) {
          originalWords.pop();
          searchString = originalWords.join(' ');
        }
      }
  
      // Final fallback: any valid suggestion
      if (!match && suggestions.length > 0) {
        match = suggestions[0];
      }
  
      console.log('Selected match:', match);
  
      if (value === latestInputRef.current) {
        setSuggestion(match || '');
      }
    } catch (err) {
      console.error('AI suggestion error:', err);
      alert(`Error: ${err.message}`);
      setSuggestion('');
    }
  };
  const debouncedFetch = useCallback(debounce(fetchAISuggestions, 1000), []);

  const handleChange = (e) => {
    const val = e.target.value ?? "";
    setIsTabClicked(false); // ✅ reset on new input
    onChange(e); // Update Formik
    if (val.trim() === "") {
      setSuggestion("");
      return;
    }
    latestInputRef.current = val;
    debouncedFetch(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      setIsTabClicked(true);
      e.preventDefault();
      const event = {
        target: {
          name,
          value: suggestion,
        },
      };
      onChange(event);
      setSuggestion("");
    }
  };

  const handleBlurInput = (e) => {
    setSuggestion(""); // Clear the suggestion on blur
    onBlur && onBlur(e); // Call the parent onBlur handler if provided
  };
  const handleBlurComponent = (e)=>{
    setSuggestion(""); // Clear the suggestion on blur
  }

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      const updatedValue = (value + ' ' + transcript).trim();

      const newEvent = {
        target: {
          name,
          value: updatedValue,
        },
      };
      setIsTabClicked(false); 
      onChange(newEvent);
      latestInputRef.current = updatedValue;
      fetchAISuggestions(updatedValue);
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
  };

  const getDisplayValue = () => {
    if (isTabClicked || !suggestion) {
      return value; // Show only the input value if Tab is clicked or no suggestion exists
    }
    return value; // Show only the input value
  };

  return (
    <div
      className={`border rounded d-flex px-1 bg-white align-items-start w-100 ${className}`}
      style={{ position: "relative" }}
    >
      <div className="row align-items-start justify-content-start h-100 w-100">
        <div onBlur={handleBlurComponent} className="col-12 position-relative d-flex align-items-center">
          {/* Input field */}
          <input
            style={{ fontSize: "14px", padding: "0px 12px" }}
            id={id}
            type={type}
            name={name}
            value={getDisplayValue()} // Display the input value
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlurInput}
            placeholder={placeholder}
            className="border-0 outline-none smart-input w-100 form-control"
            autoComplete="off"
          />

          {/* Suggestion overlay */}
          {!isTabClicked && suggestion.length > (value?.length || 0) &&  (
            <div
              className="text-muted "
              style={{
                fontSize: "14px",
                position: "absolute",
                // top: "50%",
                left: `${value?.length * 7 +25}px`,
                // transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <span className='suggestion-text'> 
               
                {suggestion.slice((value?.length || 0) )}
                 </span>
              
            </div>
          )}
        </div>
      </div>

      <div onClick={startSpeechRecognition} className="ml-2 px-2 py-1">
        <IoMicOutline className="text-black" />
      </div>
    </div>
  );
};

export default SmartInput;
