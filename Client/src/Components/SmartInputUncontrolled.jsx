import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';

const SmartInputUnControlled = () => {
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef(null); // Ref to the input element
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
    const words = text.split(' ').filter((word) => word !== '');
    if (words.length <= 4) {
      return text.trim();
    }
    return words.slice(0, 4).join(' ') + '...';
  };

  const handleChange = (e) => {
    const value = e.target.value ?? '';
    latestInputRef.current = value; // ✅ store string value
    if (value.trim() === '') {
      setSuggestion('');
      return;
    }
    debouncedFetch(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.value = suggestion; // ✅ safely update DOM
      }
      latestInputRef.current = suggestion;
      setSuggestion('');
    }
  };

  // Speech recognition
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
      const updatedInput = (latestInputRef.current + ' ' + transcript).trim();

      console.log('Speech Input:', updatedInput);
      if (inputRef.current) {
        inputRef.current.value = updatedInput; // ✅ update DOM
      }
      latestInputRef.current = updatedInput;
      fetchAISuggestions(updatedInput);
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
  };

  return (
    <div style={{ width: '100%' }} className="border rounded d-flex px-1 w-full">
      <div className="row w-100">
        <div className={`${suggestion ? 'col-4' : 'col-12'}`}>
          {/* ✏️ Actual input */}
          <input
            style={{ width: '100%' }}
            ref={inputRef}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type or speak..."
            className="border-0 outline-none smart-input"
            autoComplete="off"
          />
        </div>
        <div className={`${suggestion ? 'col-8' : 'col-0 d-none'}`}>
          {/* 👻 Ghost suggestion overlay */}
          {suggestion.length > latestInputRef.current.length && (
            <div className="text-secondary">
              {truncateSuggestion(suggestion.slice(latestInputRef.current.length))}
            </div>
          )}
        </div>
      </div>

      {/* 🎤 Voice button */}
      <div onClick={startSpeechRecognition} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
        🎙️
      </div>
    </div>
  );
};

export default SmartInputUnControlled;