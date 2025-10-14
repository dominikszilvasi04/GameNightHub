import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import LobbyItem from '../components/LobbyItem';
import Button from '../components/Button';
import Modal from '../components/Modal';
import CreateLobbyForm from '../components/CreateLobbyForm';
import LobbyDetailView from '../components/LobbyDetailView'; 
import JoinPrivateLobbyForm from '../components/JoinPrivateLobbyForm';

const LobbiesPage = () => {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLobbyId, setSelectedLobbyId] = useState(null); 
  const { user } = useContext(AuthContext);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

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

  const handleLobbyJoined = (joinedLobby) => {
    // You could either refresh the list or add it if it's not there
    setLobbies(prev => [joinedLobby, ...prev.filter(l => l._id !== joinedLobby._id)]);
    setIsJoinModalOpen(false);
  };

  const handleLobbyCreated = (newLobby) => {
    setLobbies([newLobby, ...lobbies]);
    setIsCreateModalOpen(false);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading lobbies...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Lobbies</h1>
        {user && (
          <div className="flex space-x-4">
            <Button onClick={() => setIsJoinModalOpen(true)}>Join Private Lobby</Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create New Lobby</Button>
          </div>
        )}
      </div>

      {lobbies.length > 0 ? (
        lobbies.map((lobby) => (
          // Pass the handler function to each item
          <LobbyItem key={lobby._id} lobby={lobby} onView={setSelectedLobbyId} />
        ))
      ) : (
        <p className="text-center mt-8">No public lobbies found. Why not create one?</p>
      )}

      {/* Modal for Creating a Lobby */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CreateLobbyForm onLobbyCreated={handleLobbyCreated} />
      </Modal>

      {/* Modal for Viewing a Lobby */}
      <Modal isOpen={!!selectedLobbyId} onClose={() => setSelectedLobbyId(null)}>
        {selectedLobbyId && <LobbyDetailView lobbyId={selectedLobbyId} />}
      </Modal>
      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)}>
        <JoinPrivateLobbyForm onLobbyJoined={handleLobbyJoined} />
      </Modal>
    </div>
  );
};

export default LobbiesPage;