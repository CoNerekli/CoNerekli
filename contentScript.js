// contentScript.js

// Import Firebase SDK (použijte cestu ke staženým souborům SDK nebo CDN)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
};

// Inicializace Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function createNotesPanel() {
  const panel = document.createElement('div');
  panel.id = 'conerekli-notes-panel';
  panel.innerHTML = `
    <textarea id="note-input" placeholder="Napište svoji poznámku..."></textarea>
    <button id="save-note">Uložit poznámku</button>
    <div id="notes-display"><p>Načítám poznámky...</p></div>
  `;

  // Přidání stylů přímo v JavaScriptu
  panel.style.position = 'fixed';
  panel.style.top = '50px';
  panel.style.right = '20px';
  panel.style.width = '320px';
  panel.style.backgroundColor = '#f9f9f9';
  panel.style.border = '1px solid #ddd';
  panel.style.padding = '15px';
  panel.style.zIndex = '9999';
  panel.style.fontFamily = 'Arial, sans-serif';
  panel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

  document.body.appendChild(panel);

  document.getElementById('save-note').addEventListener('click', saveNote);
  loadNotes();
}

function saveNote() {
  const noteContent = document.getElementById('note-input').value.trim();
  const listingUrl = window.location.href;

  if (!noteContent) {
    alert('Prosím napište poznámku před uložením.');
    return;
  }

  const notesRef = firebase.firestore().collection('notes');
  notesRef.add({
    url: listingUrl,
    content: noteContent,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    console.log('Poznámka byla úspěšně uložena');
    document.getElementById('note-input').value = '';
    loadNotes();
  }).catch((error) => {
    console.error('Chyba při ukládání poznámky:', error);
  });
}

function loadNotes() {
  const listingUrl = window.location.href;
  const notesRef = firebase.firestore().collection('notes');
  notesRef.where('url', '==', listingUrl).orderBy('timestamp', 'desc').get()
    .then((snapshot) => {
      const notesDisplay = document.getElementById('notes-display');
      notesDisplay.innerHTML = '';

      if (snapshot.empty) {
        notesDisplay.innerHTML = '<p>Žádné poznámky zatím nejsou.</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const noteData = doc.data();
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
          <p>${noteData.content}</p>
          <span>${noteData.timestamp ? new Date(noteData.timestamp.toDate()).toLocaleString() : ''}</span>
        `;
        notesDisplay.appendChild(noteElement);
      });
    })
    .catch((error) => {
      console.error('Chyba při načítání poznámek:', error);
      document.getElementById('notes-display').innerHTML = '<p>Chyba při načítání poznámek.</p>';
    });
}

(function() {
  createNotesPanel();
})();
