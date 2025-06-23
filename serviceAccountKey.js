const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.GOOGLE_TYPE,
  project_id: 'aborgiba', // مباشرة نص ثابت للتجربة
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // must replace literal "\n"
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

console.log('Firebase Service Account:', serviceAccount);
console.log('Type of project_id:', typeof serviceAccount.project_id);
console.log('serviceAccount keys:', Object.keys(serviceAccount));
console.log('project_id typeof:', typeof serviceAccount.project_id);
console.log('project_id value:', serviceAccount.project_id);
console.log('isPlainObject:', Object.getPrototypeOf(serviceAccount) === Object.prototype);
console.log('serviceAccount JSON:', JSON.stringify(serviceAccount));
const plainServiceAccount = toPlainObject(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
