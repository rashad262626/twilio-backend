const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Twilio Setup
const twilioClient = twilio('AC918512eaf7657cfab77b04fbb1a57b9e', 'da9876d647bc0de38a3826aaa3a8c79d');
const twilioNumber = '+Your_Twilio_Number';

const otpStore = {}; // In production, use Redis or DB

app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await twilioClient.messages.create({
      body: `رمز التحقق الخاص بك هو: ${otp}`,
      from: twilioNumber,
      to: phone,
    });
    otpStore[phone] = otp;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'فشل إرسال الرسالة' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore[phone] === otp) {
    delete otpStore[phone];
    const uid = `twilio_${phone}`;
    const customToken = await admin.auth().createCustomToken(uid);
    res.json({ token: customToken });
  } else {
    res.status(400).json({ error: 'رمز غير صحيح' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
