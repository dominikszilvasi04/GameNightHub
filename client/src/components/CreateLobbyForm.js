import React, { useState } from 'react';
import api from '../api';
import Button from './Button';

const CreateLobbyForm = ({ onLobbyCreated }) => {
  const [formData, setFormData] = useState({
    game: '',
    description: '',
    maxPlayers: 5,
    isPrivate: false,
    password: ''
  });

  const { game, description, maxPlayers } = formData;

  const onChange = (e) => {
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  setFormData({ ...formData, [e.target.name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // The interceptor now handles the token automatically!
      const res = await api.post('/lobbies', formData);
      onLobbyCreated(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to create lobby');
    }
  };


  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold mb-4">Create a New Lobby</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Game Title</label>
        <input
          type="text"
          name="game"
          value={game}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={description}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Max Players</label>
        <input
          type="number"
          name="maxPlayers"
          value={maxPlayers}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          min="2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={onChange}
            className="mr-2"
          />
          <span>Make Lobby Private</span>
        </label>
      </div>
      {formData.isPrivate && (
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
      )}

      <Button type="submit" fullWidth>Create Lobby</Button>
    </form>
  );
};

export default CreateLobbyForm;