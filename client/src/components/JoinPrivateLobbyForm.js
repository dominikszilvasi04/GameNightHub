import React, { useState } from 'react';
import api from '../api';
import Button from './Button';

const JoinPrivateLobbyForm = ({ onLobbyJoined }) => {
  const [lobbyId, setLobbyId] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/lobbies/join_private', { lobbyId, password });
      onLobbyJoined(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response.data.msg || 'Failed to join lobby');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold mb-4">Join a Private Lobby</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Lobby ID</label>
        <input
          type="text"
          value={lobbyId}
          onChange={(e) => setLobbyId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <Button type="submit" fullWidth>Join Lobby</Button>
    </form>
  );
};

export default JoinPrivateLobbyForm;