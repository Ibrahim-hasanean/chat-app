import { useContext, createContext } from "react";

export const authContext = createContext();

const useAuthContext = () => useContext(authContext);

export default useAuthContext;
