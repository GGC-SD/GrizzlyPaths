import ReactDOM from "react-dom/client";
import App from "./App";

//imports firebase to folder
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import Bootstrap and your custom CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './interfaceSettings.css';

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
