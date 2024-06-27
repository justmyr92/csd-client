import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyDr3RF2bugmCcUGlCrs858KhDK4zjgQjLU",
    authDomain: "dashboard-b235f.firebaseapp.com",
    projectId: "dashboard-b235f",
    storageBucket: "dashboard-b235f.appspot.com",
    messagingSenderId: "1082187571413",
    appId: "1:1082187571413:web:32435e66d08692abcf025c",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
