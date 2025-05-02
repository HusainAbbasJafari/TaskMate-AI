import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';

const ChatContent = ({ chat }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="chat-messages d-flex flex-column p-3 overflow-y-auto">
      {chat?.map((message, index) => (
        <div
          key={index}
          style={{ maxWidth: !message.type === 'bot' ? '80%' : '100%' }}
          className={`d-flex flex-column ${message.type === 'user' ? 'align-self-end' : 'align-self-start'} mb-3`}
        >
          <div
            className={`p-1 rounded text-white ${
              message.type === 'user' ? 'usermessage text-start' : 'bg-secondary text-start'
            }`}
          >
            <div className={`${message.type === 'bot' ? 'bg-bot' : 'bg-user'} p-2 rounded`}>
              {message.type === 'bot' && message.text === '...' ? (
                <div className="loader mt-3"></div>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');

                      if (!inline && match) {
                        return (
                          <div className="position-relative my-2">
                            <div className="copy-btn position-absolute top-0 end-0 me-2 mt-2">
                              <button
                                onClick={() => handleCopy(codeString, index)}
                                className="btn btn-sm btn-outline-light"
                              >
                                {copiedIndex === index ? <FiCheck /> : <FiCopy />}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              language={match[1]}
                              style={vscDarkPlus}
                              showLineNumbers
                              PreTag="div"
                              wrapLines
                              customStyle={{ borderRadius: '0.5rem' }}
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        );
                      }

                      return (
                        <code className="bg-dark px-1 py-0 rounded text-warning">{children}</code>
                      );
                    },
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContent;
