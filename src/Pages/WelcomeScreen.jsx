import { useEffect } from "react";

const WelcomeScreen = ({ onLoadingComplete }) => {
  useEffect(() => {
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  return null;
};

export default WelcomeScreen;