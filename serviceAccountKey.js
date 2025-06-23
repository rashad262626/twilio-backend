

// Firebase Admin Setup
const admin = require('firebase-admin');
const serviceAccount = {
  type: String(process.env.GOOGLE_TYPE),
  project_id: String(process.env.GOOGLE_PROJECT_ID),
  private_key_id: String(process.env.GOOGLE_PRIVATE_KEY_ID),
  private_key: String(process.env.GOOGLE_PRIVATE_KEY).replace(/\\n/g, '\n'),
  client_email: String(process.env.GOOGLE_CLIENT_EMAIL),
  client_id: String(process.env.GOOGLE_CLIENT_ID),
  auth_uri: String(process.env.GOOGLE_AUTH_URI),
  token_uri: String(process.env.GOOGLE_TOKEN_URI),
  auth_provider_x509_cert_url: String(process.env.GOOGLE_AUTH_PROVIDER_CERT_URL),
  client_x509_cert_url: String(process.env.GOOGLE_CLIENT_CERT_URL),
  universe_domain: String(process.env.GOOGLE_UNIVERSE_DOMAIN),
};
console.log('Firebase Service Account:', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Twilio Setup
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
