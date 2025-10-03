import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const LobbyDetailPage = () => {
  const { id } = useParams(); // Gets the ':id' from the URL
  const [lobby, setLobby] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const res = await api.get(`/lobbies/${id}`);
        setLobby(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLobby();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return <p>Loading lobby...</p>;
  }

  if (!lobby) {
    return <p>Lobby not found.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
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
    </div>
  );
};

export default LobbyDetailPage;