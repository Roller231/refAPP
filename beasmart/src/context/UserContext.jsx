import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // 👈 ВСЕ ПОЛЬЗОВАТЕЛИ
  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
