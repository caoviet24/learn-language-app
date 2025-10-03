import { authContext } from "@/providers/auth-provider";
import { useContext } from "react";


const useAuth = () => useContext(authContext);
export default useAuth;