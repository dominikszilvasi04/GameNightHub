import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import LobbyItem from '../components/LobbyItem';
import Button from '../components/Button';

const LobbiesPage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const res = await api.get('/lobbies');
        setLobbies(res.data);
      } catch (err) {
        console.error('Error fetching lobbies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLobbies();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  if (loading) {
    return <p className="text-center mt-8">Loading lobbies...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Public Lobbies</h1>
        {user && (
          <Button>Create New Lobby</Button>
        )}
      </div>

      {lobbies.length > 0 ? (
        lobbies.map(lobby => (
          <LobbyItem key={lobby._id} lobby={lobby} />
        ))
      ) : (
        <p className="text-center mt-8">No public lobbies found. Why not create one?</p>
      )}
    </div>
  );
};

export default LobbiesPage;