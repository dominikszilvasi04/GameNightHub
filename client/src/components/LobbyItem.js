import React from 'react';
import Button from './Button';
import PlaceholderImage from './PlaceholderImage'; // <-- Import our new component

const LobbyItem = ({ lobby, onView }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-4 flex h-32 overflow-hidden">
      {/* Conditionally render the image or the placeholder */}
      {lobby.imageUrl ? (
        <img
          src={lobby.imageUrl}
          alt={lobby.game}
          className="w-48 object-cover"
        />
      ) : (
        <PlaceholderImage text={lobby.game} />
      )}

      <div className="p-4 flex-grow flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{lobby.game}</h3>
          <p className="text-gray-600 mt-1 truncate max-w-xs">{lobby.description || 'No description provided.'}</p>
          <p className="text-sm text-gray-500 mt-2">Created by: {lobby.creator.username}</p>
        </div>
        <div className="text-center flex-shrink-0 ml-4">
          <div className="text-lg font-semibold">
            {lobby.players.length} / {lobby.maxPlayers}
          </div>
          <div className="text-sm text-gray-500">Players</div>
          <div className="mt-2">
            <Button onClick={() => onView(lobby._id)}>View</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyItem;