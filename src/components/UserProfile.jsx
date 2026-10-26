import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, clearUser, updateUserName } from '../store/userSlice';

function UserProfile() {
  const dispatch = useDispatch();
  const { data: user, loading, error } = useSelector((state) => state.user);
  const [newName, setNewName] = React.useState('');

  const handleLoadUser = () => {
    dispatch(fetchUser(1));
  };

  const handleClearUser = () => {
    dispatch(clearUser());
    setNewName('');
  };

  const handleUpdateName = () => {
    if (newName.trim()) {
      dispatch(updateUserName(newName));
      setNewName('');
    }
  };

  if (loading) {
    return <div data-testid="user-loading">Loading user...</div>;
  }

  if (error) {
    return (
      <div data-testid="user-error">
        Error: {error}
        <button onClick={handleLoadUser} data-testid="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div data-testid="user-profile">
      {user ? (
        <>
          <h3 data-testid="user-profile-title">User Profile</h3>
          <p data-testid="user-name-display">Name: {user.name}</p>
          <p data-testid="user-email-display">Email: {user.email}</p>
          <p data-testid="user-status-display">Status: {user.status}</p>
          
          <div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              data-testid="name-input"
            />
            <button
              onClick={handleUpdateName}
              data-testid="update-name-btn"
            >
              Update Name
            </button>
          </div>
          
          <button onClick={handleClearUser} data-testid="clear-btn">
            Clear User
          </button>
        </>
      ) : (
        <div>
          <p data-testid="no-user-message">No user loaded</p>
          <button onClick={handleLoadUser} data-testid="load-btn">
            Load User
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
