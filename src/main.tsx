import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove loading screen after React renders
const removeLoadingScreen = () => {
  const loadingScreen = document.querySelector('.loading-screen') as HTMLElement;
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 300);
  }
};

const root = createRoot(document.getElementById("root")!);

// Render app and then remove loading screen
root.render(<App />);

// Remove loading screen after a small delay to ensure React has rendered
setTimeout(removeLoadingScreen, 100);
