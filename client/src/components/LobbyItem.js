import React from 'react';
import Button from './Button';

const LobbyItem = ({ lobby, onView }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{lobby.game}</h3>
        <p className="text-gray-600 mt-1">{lobby.description || 'No description provided.'}</p>
        <p className="text-sm text-gray-500 mt-2">Created by: {lobby.creator.username}</p>
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold">
          {lobby.players.length} / {lobby.maxPlayers}
        </div>
        <div className="text-sm text-gray-500">Players</div>
        <div className="mt-2">
          <Button onClick={() => onView(lobby._id)}>View</Button>
        </div>
      </div>
    </div>
  );
};

export default LobbyItem;