import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      navigate("/movies");
    }
  }, [navigate]);

  return <SignIn />;
};

export default Index;
