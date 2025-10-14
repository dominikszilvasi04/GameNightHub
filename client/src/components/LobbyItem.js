import React from 'react';
import Button from './Button';
import PlaceholderImage from './PlaceholderImage';

const LobbyItem = ({ lobby, onView }) => {
  return (
    // PARENT CONTAINER: Has 'flex' and a fixed height 'h-32'.
    // This is the container that controls the layout.
    <div className="bg-white shadow-md rounded-lg mb-4 flex h-32 overflow-hidden">
      
      {/* CHILD 1: The Image or Placeholder */}
      {lobby.imageUrl ? (
        <img
          src={lobby.imageUrl}
          alt={lobby.game}
          // 'w-48' gives it a fixed width.
          // 'object-cover' makes the image fill the space without distortion.
          // 'flex-shrink-0' prevents it from being squished.
          // NO 'h-full' is needed; it will stretch automatically to the parent's height.
          className="w-48 object-cover flex-shrink-0"
        />
      ) : (
        <PlaceholderImage text={lobby.game} />
      )}

      {/* CHILD 2: The Text Content */}
      <div className="p-4 flex-grow flex justify-between items-center min-w-0">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gray-800 truncate">{lobby.game}</h3>
          <p className="text-gray-600 mt-1 truncate">{lobby.description || 'No description provided.'}</p>
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