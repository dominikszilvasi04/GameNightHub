import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import Button from './Button';

const CreateLobbyForm = ({ onLobbyCreated }) => {
  const [formData, setFormData] = useState({
    game: '',
    description: '',
    maxPlayers: 5,
    isPrivate: false,
    password: '',
    imageUrl: '',
  });

  const [imageOptions, setImageOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleImageSearch = useCallback(async () => {
    if (formData.game.length <= 2) {
      setImageOptions([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.get(`/utils/search-images?query=${formData.game}`);
      setImageOptions(res.data);
    } catch (err) {
      console.error('Image search failed:', err);
      setImageOptions([]); // Clear options on error
    }
    setIsSearching(false);
  }, [formData.game]);

  // This "debounces" the search to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      handleImageSearch();
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(handler);
  }, [formData.game, handleImageSearch]);

  const { game, description, maxPlayers, isPrivate, password, imageUrl } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting this data:', formData);
    try {
      const res = await api.post('/lobbies', formData);
      onLobbyCreated(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to create lobby');
    }
  };

  console.log('Current Form Data:', formData);

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold mb-4">Create a New Lobby</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700">Game Title</label>
        <input type="text" name="game" value={game} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" required />
      </div>

      {/* THIS IS THE SECTION THAT SHOULD APPEAR */}
      {isSearching && <p className="text-sm text-gray-500">Searching for images...</p>}
      {imageOptions.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700">Select Cover Art</label>
          <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-100 rounded">
            {imageOptions.map((url, index) => (
              <img
                key={index} src={url} alt={`${game} cover ${index}`}
                className={`w-32 h-20 object-cover rounded cursor-pointer border-4 flex-shrink-0 ${imageUrl === url ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setFormData({ ...formData, imageUrl: url })}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700">Or Paste Image URL</label>
        <input type="text" name="imageUrl" value={imageUrl} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="https://example.com/image.jpg" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <input type="text" name="description" value={description} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Max Players</label>
        <input type="number" name="maxPlayers" value={maxPlayers} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" min="2" required />
      </div>

      <div className="mb-4">
        <label className="flex items-center"><input type="checkbox" name="isPrivate" checked={isPrivate} onChange={onChange} className="mr-2" /><span>Make Lobby Private</span></label>
      </div>
      {isPrivate && (
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" required />
        </div>
      )}

      <Button type="submit" fullWidth>Create Lobby</Button>
    </form>
  );
};

export default CreateLobbyForm;