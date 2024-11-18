// popup.js

// Firebase konfigurace
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// Inicializace Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const provider = new firebase.auth.GoogleAuthProvider();

document.getElementById('sign-in-button').addEventListener('click', () => {
  firebase.auth().signInWithPopup(provider).then((result) => {
    console.log('Uživatel přihlášen:', result.user);
    updateUI(true);
  }).catch((error) => {
    console.error('Chyba při přihlašování:', error);
  });
});

document.getElementById('sign-out-button').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    console.log('Uživatel odhlášen.');
    updateUI(false);
  }).catch((error) => {
    console.error('Chyba při odhlašování:', error);
  });
});

function updateUI(isSignedIn) {
  document.getElementById('sign-in-button').style.display = isSignedIn ? 'none' : 'block';
  document.getElementById('sign-out-button').style.display = isSignedIn ? 'block' : 'none';
}

firebase.auth().onAuthStateChanged((user) => {
  updateUI(!!user);
});
