import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import Button from './Button';

const Chat = ({ lobbyId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useContext(AuthContext);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io('http://localhost:5001');

    // Join the specific lobby room
    socketRef.current.emit('joinLobby', lobbyId);

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [lobbyId]);

  // Effect to scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      socketRef.current.emit('sendMessage', {
        lobbyId,
        message: newMessage,
        user: { username: user.username },
      });
      setNewMessage('');
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Lobby Chat</h2>
      <div className="h-48 overflow-y-auto bg-gray-100 p-2 rounded-lg mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong style={{ color: user.username === msg.user.username ? 'blue' : 'black' }}>
              {msg.user.username}:
            </strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          placeholder="Type a message..."
        />
        <Button type="submit" >Send</Button>
      </form>
    </div>
  );
};

export default Chat;