import React, { useState, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { IoMicOutline } from "react-icons/io5";

const SmartInput = ({ value="", onChange, onBlur, name, placeholder="Type or Speak..." ,className,type,id}) => {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const latestInputRef = useRef(''); // Track the latest input value

 
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

  const truncateSuggestion = (text) => {
    const words = text.split(' ').filter(word => word !== '');
    if (words.length <= 4) {
      return text.trim();
    }
    return words.slice(0, 4).join(' ') + '...';
  };
  
//   const handleChange = (e) => {
//     const value = e.target.value ?? '';
//     console.log("Input:", value);
//     setInput(value);
  
//     if (value.trim() === '') {
//       setSuggestion('');
//       return;
//     }
//     latestInputRef.current = value;
  
// console.log("LatestInputRef:", latestInputRef.current);

//     debouncedFetch(value);
//   };

const handleChange = (e) => {
  const val = e.target.value ?? '';
  onChange(e); // <-- Update Formik
  if (val.trim() === '') {
    setSuggestion('');
    return;
  }
  latestInputRef.current = val;
  debouncedFetch(val);
};
  

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Tab' && suggestion) {
  //     e.preventDefault();
  //     setInput(suggestion);
  //     setSuggestion('');
  //   }
  // };
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      const event = {
        target: {
          name,
          value: suggestion,
        },
      };
      onChange(event);
      setSuggestion('');
    }
  };

  // Speech recognition
  // const startSpeechRecognition = () => {
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (!SpeechRecognition) {
  //     alert('Speech recognition not supported in this browser.');
  //     return;
  //   }

  //   const recognition = new SpeechRecognition();
  //   recognition.lang = 'en-US';
  //   recognition.interimResults = false;

  //   recognition.onresult = function (event) {
  //     const transcript = event.results[0][0].transcript;
  //     const updatedInput = (input + ' ' + transcript).trim();

  //     console.log("Speech Input:", updatedInput);
  //     setInput(updatedInput);
  //     latestInputRef.current = updatedInput;
  //     fetchAISuggestions(updatedInput); // ← directly fetch
  //   };
    

  //   recognition.onerror = function (event) {
  //     console.error('Speech recognition error', event.error);
  //   };

  //   recognition.start();
  // };
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
      onChange(newEvent);
      latestInputRef.current = updatedValue;
      fetchAISuggestions(updatedValue);
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
  };

  return (
    
//       <div
//       style={{ width: '100%' }}
//       className=" border rounded d-flex px-1  bg-white d-flex align-items-center w-full">

//        <div className="row  w-100">
//         <div className={`${suggestion ? 'col-4' : 'col-12'}`}>
//               {/* ✏️ Actual input */}
//         <input
//           style={{ width: '100%' }}
       
//         value={input}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//         placeholder="Type or speak..."
//         className="border-0 outline-none smart-input"
//         autoComplete="off"
//       />
//         </div>
//         <div className={`${suggestion ? 'col-8' : 'col-0 d-none'}`}>
        
//          {/* 👻 Ghost suggestion overlay */}
         
//          {suggestion.length > input.length && (
//   <div className="text-secondary">
//     {truncateSuggestion(suggestion.slice(input.length))}
//   </div>
// )}

//         </div>


//        </div>

      
      
        
//         {/* 🎤 Voice button */}
//         <div
//           onClick={startSpeechRecognition}
//           className="ml-2 px-2 py-1 "
//         >
//           <IoMicOutline className='text-black'/>
//         </div>

//       </div>

     <div className={`border rounded d-flex px-1 bg-white align-items-start w-100  ${className}`}>
      <div className="row align-items-start justify-content-start h-100 w-100">
        <div className={`${suggestion ? 'col-4' : 'col-12'}`}>
          <input
            style={{ fontSize: '14px',padding:"0px 12px " }}
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            className="border-0 outline-none smart-input w-100 form-control"
            autoComplete="off"
          />
        </div>
        <div className={`${suggestion ? 'col-8' : 'col-0 d-none'}`}>
          {suggestion.length > (value?.length || 0) && (
            <div className="text-secondary">
              {truncateSuggestion(suggestion.slice((value?.length || 0) ))}
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
