import React, { useState, useEffect } from 'react';
import api from '../api';
import Button from './Button';

const LobbyDetailView = ({ lobbyId }) => {
  const [lobby, setLobby] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLobby = async () => {
      if (!lobbyId) return;
      setLoading(true);
      try {
        const res = await api.get(`/lobbies/${lobbyId}`);
        setLobby(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLobby();
  }, [lobbyId]);

  if (loading) return <p>Loading lobby details...</p>;
  if (!lobby) return <p>Could not load lobby details.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{lobby.game}</h1>
      <p className="text-gray-700 mb-6">{lobby.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p><strong>Creator:</strong> {lobby.creator.username}</p>
          <p><strong>Status:</strong> {lobby.isPrivate ? 'Private' : 'Public'}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Players ({lobby.players.length} / {lobby.maxPlayers})</h2>
          <ul className="list-disc list-inside">
            {lobby.players.map(player => (
              <li key={player._id}>{player.username}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button>Join Lobby</Button>
      </div>
    </div>
  );
};

export default LobbyDetailView;