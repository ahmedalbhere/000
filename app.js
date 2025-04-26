// app.js

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get user's location
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;
  loadBarbers(userLat, userLon);
}

function error() {
  document.getElementById('barber-list').innerHTML = '<p>فشل في تحديد الموقع. تأكد من تفعيل خدمة الموقع.</p>';
}

// Load barbers from Firestore
function loadBarbers(userLat, userLon) {
  db.collection("barbers").get().then(snapshot => {
    let html = '';
    snapshot.forEach(doc => {
      const barber = doc.data();
      const distance = getDistance(userLat, userLon, barber.lat, barber.lon);
      
      html += `
        <div class="barber-card">
          <img src="${barber.photoURL || 'default-barber.jpg'}" alt="Barber Photo">
          <div class="barber-info">
            <h3>${barber.name}</h3>
            <p>الصالون: ${barber.salonName}</p>
            <p>⭐ التقييم: ${barber.rating || 'غير متوفر'}</p>
            <p>🕒 العملاء بالانتظار: ${barber.waiting || 0}</p>
            <p>📍 على بعد ${distance.toFixed(2)} كم</p>
          </div>
        </div>
      `;
    });

    document.getElementById('barber-list').innerHTML = html;
  });
}

// Helper to calculate distance between two points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}
