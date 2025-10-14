import React, { useState } from 'react';
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
  // New state to track which image we're currently showing
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // We no longer need the useEffect for automatic searching.

  const handleImageSearch = async (e) => {
    e.preventDefault(); // Prevent form submission if it's a button in a form
    if (formData.game.length <= 2) {
      alert('Please enter a game title with at least 3 characters.');
      return;
    }
    setIsSearching(true);
    setCurrentImageIndex(0); // Reset to the first image on a new search
    try {
      const res = await api.get(`/utils/search-images?query=${formData.game}`);
      setImageOptions(res.data);
      // Automatically select the first image result
      setFormData({ ...formData, imageUrl: res.data[0] || '' });
    } catch (err) {
      console.error('Image search failed:', err);
      setImageOptions([]);
    }
    setIsSearching(false);
  };

  // New function to cycle through the found images
  const handleRegenerate = () => {
    if (imageOptions.length === 0) return;
    const nextIndex = (currentImageIndex + 1) % imageOptions.length;
    setCurrentImageIndex(nextIndex);
    setFormData({ ...formData, imageUrl: imageOptions[nextIndex] });
  };
  
  const { game, description, maxPlayers, isPrivate, password, imageUrl } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/lobbies', formData);
      onLobbyCreated(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to create lobby');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold mb-6">Create a New Lobby</h2>
      
      {/* MAIN LAYOUT:
        - `flex-col`: Stacks columns vertically on small screens (default).
        - `md:flex-row`: Switches to a horizontal row on medium screens and up.
        - `md:space-x-6`: Adds horizontal space only on medium screens and up.
      */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        
        {/* Left Column: Form Fields */}
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-gray-700">Game Title</label>
            <div className="flex space-x-2">
              <input type="text" name="game" value={game} onChange={onChange} className="flex-grow p-2 border border-gray-300 rounded mt-1" required />
              <Button onClick={handleImageSearch}>Search</Button>
            </div>
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
        </div>

        {/* RIGHT COLUMN:
          - `w-full`: Takes full width on small screens.
          - `md:w-1/3`: Takes 1/3 width on medium screens and up.
          - `mt-6 md:mt-0`: Adds margin on top for small screens, but removes it for medium and up.
        */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          <label className="block text-gray-700 mb-1">Lobby Picture</label>
          <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
            {isSearching ? (
              <p>Searching...</p>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Lobby preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <p className="text-gray-500 text-sm">No image selected</p>
            )}
          </div>
          {imageOptions.length > 1 && (
            <Button onClick={handleRegenerate} fullWidth>Regenerate</Button>
          )}
          <div className="mt-2">
             <label className="block text-gray-700 text-sm">Or Paste URL</label>
             <input type="text" name="imageUrl" value={imageUrl} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1 text-sm" />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button type="submit" fullWidth>Create Lobby</Button>
      </div>
    </form>
  );
};

export default CreateLobbyForm;