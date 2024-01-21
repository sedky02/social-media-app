import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextAuth, IUser } from "@/types";
import { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextAuth>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.$id,
          name: currentUser.name,
          username: currentUser.username,
          email: currentUser.email,
          imageUrl: currentUser.imageUrl,
          bio: currentUser.bio,
        });
        setIsAuthenticated(true);
        // setIsLoading(false);
        return true;
      }
    //   setIsLoading(false);
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    
    if (
      localStorage.getItem("cookieFallback") === "[]"  
      // localStorage.getItem("cookieFallback") === null
    ){
      navigate("/sign-in");
    }
    checkAuthUser();
  }, []);
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
