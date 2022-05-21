importScripts("https://www.gstatic.com/firebasejs/9.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDCiCWjf3tms077CnqgiP0zWhFqQjzLdRc",
    authDomain: "self-service-4820d.firebaseapp.com",
    databaseURL: "https://self-service-4820d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "self-service-4820d",
    storageBucket: "self-service-4820d.appspot.com",
    messagingSenderId: "602646727662",
    appId: "1:602646727662:web:4a04ae181bf1bff0e49cff",
    measurementId: "G-QJ6RDGZW09"
});

const messaging = firebase.messaging();
