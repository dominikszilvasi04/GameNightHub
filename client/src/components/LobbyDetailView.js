import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import Button from './Button';
import AuthContext from '../context/AuthContext'; 

const LobbyDetailView = ({ lobbyId }) => {
  const [lobby, setLobby] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get the logged-in user

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

  const handleJoin = async () => {
    try {
      const res = await api.put(`/lobbies/${lobbyId}/join`);
      setLobby(res.data); // Update the view with the new lobby data
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleLeave = async () => {
    try {
      const res = await api.put(`/lobbies/${lobbyId}/leave`);
      setLobby(res.data); // Update the view with the new lobby data
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  if (loading) return <p>Loading lobby details...</p>;
  if (!lobby) return <p>Could not load lobby details.</p>;

  // Check if the current user is in the lobby's player list
  const isUserInLobby = user && lobby.players.some(player => player._id === user.id);
  const isLobbyFull = lobby.players.length >= lobby.maxPlayers;

  const renderJoinButton = () => {
    if (!user) return null; // Don't show button if not logged in

    if (isUserInLobby) {
      return <Button onClick={handleLeave}>Leave Lobby</Button>;
    }

    if (isLobbyFull) {
      return <Button disabled>Lobby is Full</Button>;
    }

    return <Button onClick={handleJoin}>Join Lobby</Button>;
  };

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
        {renderJoinButton()}
      </div>
    </div>
  );
};

export default LobbyDetailView;