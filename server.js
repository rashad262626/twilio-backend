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
const twilioNumber = '+0018782830964'; // Your Twilio number

const otpStore = {}; // Use Redis or DB in production

// Send OTP
app.post('/send-otp', async (req, res) => {
  console.log('[SEND_OTP] Received request:', req.body);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    console.log('[SEND_OTP] Sending SMS via Twilio to', req.body.phone);
    await twilioClient.messages.create({
      body: `رمز التحقق الخاص بك هو: ${otp}`,
      from: twilioNumber,
      to: req.body.phone,
    });
    console.log('[SEND_OTP] SMS sent successfully');
    otpStore[req.body.phone] = otp;
    res.json({ success: true });
  } catch (error) {
    console.error('[SEND_OTP] Twilio error:', error);
    res.status(500).json({ error: 'فشل إرسال الرسالة' });
  }
});// Verify OTP and return Firebase Custom Token
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  console.log(`[VERIFY-OTP] Received phone: ${phone}, otp: ${otp}`);

  if (otpStore[phone] === otp) {
    console.log(`[VERIFY-OTP] OTP match for phone: ${phone}`);
    delete otpStore[phone];

    const uid = `twilio_${phone}`;
    try {
      const customToken = await admin.auth().createCustomToken(uid);
      console.log(`[VERIFY-OTP] Created custom token for uid: ${uid}`);

      res.json({ token: customToken });
    } catch (err) {
      console.error(`[VERIFY-OTP] Error creating custom token:`, err);
      res.status(500).json({ error: 'فشل إنشاء التوكن' });
    }
  } else {
    console.warn(`[VERIFY-OTP] Invalid OTP for phone: ${phone}`);
    res.status(400).json({ error: 'رمز غير صحيح' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
