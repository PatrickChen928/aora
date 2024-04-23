import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/user';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((res) => {
        if (res) {
          setUser(res);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
        setLoading(false);
      }).catch((e) => {
        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
      })
  }, []);

  return (
    <GlobalContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      loading
    }}>
      {children}
    </GlobalContext.Provider>
  );
};