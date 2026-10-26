import React, { useState, useEffect } from 'react';

function AsyncComponent({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 100));

        if (userId === 1) {
          setUser({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
          });
        } else if (userId === 2) {
          setUser({
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
          });
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div data-testid="loading">Loading user data...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>;
  }

  if (!user) {
    return <div data-testid="no-user">No user selected</div>;
  }

  return (
    <div data-testid="user-info">
      <h3>User Information</h3>
      <p data-testid="user-name">Name: {user.name}</p>
      <p data-testid="user-email">Email: {user.email}</p>
      <p data-testid="user-role">Role: {user.role}</p>
    </div>
  );
}

export default AsyncComponent;