import { h, createContext } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';

 export const AuthContext = createContext({
  isAuthenticated: false,
  toggleAuth: () => {}
});

export function TokenproofAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleAuth = () => {
    setIsAuthenticated((prev) => !prev);
  };

  return h(
    AuthContext.Provider,
    { value: { isAuthenticated, toggleAuth } },
    children
  );
}
