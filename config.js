// === إعدادات Firebase ===
export const firebaseConfig = {
    apiKey: "AIzaSyCUVXQLCbresck9xX5Pzmsz5BAL9U4Ujds",
    authDomain: "gjldggj.firebaseapp.com",
    databaseURL: "https://gjldggj-default-rtdb.firebaseio.com",
    projectId: "gjldggj",
    storageBucket: "gjldggj.firebasestorage.app",
    messagingSenderId: "932989900371",
    appId: "1:932989900371:web:749fea242e7cefc4e1d8a6"
};

export const hashPass = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString();
};
