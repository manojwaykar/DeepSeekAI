import { useEffect } from "react";
import { useUser, useAuth, SignedIn, SignedOut, RedirectToSignIn, } from "@clerk/clerk-react";
import App from "./App";
import './prism.css';

function Dashboard() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const callEnsureUser = async () => {
      const token = await getToken();
      await fetch("https://deepseekai-backend-vwcv.onrender.com/api/v1/user/ensure-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    };

    if (isSignedIn) {
      callEnsureUser();
    }
  }, [isSignedIn, getToken]);

  return (
    <>
      <SignedIn>
        <App/>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn/>
      </SignedOut>
    </>
  );
  
}

export default Dashboard;
