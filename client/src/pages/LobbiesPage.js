import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import LobbyItem from '../components/LobbyItem';
import Button from '../components/Button';
import Modal from '../components/Modal'; 
import CreateLobbyForm from '../components/CreateLobbyForm'; 

const LobbiesPage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
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
  }, []);

  const handleLobbyCreated = (newLobby) => {
    // Add the new lobby to the top of our list and close the modal
    setLobbies([newLobby, ...lobbies]);
    setIsModalOpen(false);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading lobbies...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Public Lobbies</h1>
        {user && (
          // Make the button open the modal
          <Button onClick={() => setIsModalOpen(true)}>Create New Lobby</Button>
        )}
      </div>

      {lobbies.length > 0 ? (
        lobbies.map((lobby) => <LobbyItem key={lobby._id} lobby={lobby} />)
      ) : (
        <p className="text-center mt-8">No public lobbies found. Why not create one?</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateLobbyForm onLobbyCreated={handleLobbyCreated} />
      </Modal>
    </div>
  );
};

export default LobbiesPage;