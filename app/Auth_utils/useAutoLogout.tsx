
import { useEffect } from "react";
import { handleLogout } from "./logout";

// need to make sure before login that all tokens are destroyed of previous users
// also to make sure other cant access someones data from login page by hitting that url
const useAutoLogout = () => {
    useEffect(() => {
      (async () => {
        await handleLogout();
      })();
    }, []);
  };
  
  export default useAutoLogout;