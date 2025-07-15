// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 

// Cấu hình Firebase cho web app của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBFtOESlyJXcTdwcJgpamMW2uqPQ0Cl_jg",
  authDomain: "bloodline-adn.firebaseapp.com",
  projectId: "bloodline-adn",
  storageBucket: "bloodline-adn.firebasestorage.app", 
  messagingSenderId: "29294349875",
  appId: "1:29294349875:web:938a0bcd81e017bc1edd46",
  measurementId: "G-BRD83DJRBH"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };