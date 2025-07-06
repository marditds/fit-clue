export default async ({ req, res, log, error }) => {

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  const token = body?.token;

  if (!token) {
    return res.json({ success: false, message: 'Missing reCAPTCHA token' });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    log(secretKey);

    const verifyResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await verifyResponse.json();

    log('This is data in server-side:', data);

    if (!data.success) {
      log('Verification response data:', data);
      return res.json({ success: false, message: 'reCAPTCHA verification failed', errorCodes: data['error-codes'] });
    }

    log('reCAPTCHA verification passed.');
    return res.json({ success: true, message: 'reCAPTCHA validated successfully' });

  } catch (err) {
    error('Verification error: ' + err.message);
    return res.json({ success: false, message: 'Server error', error: err.message });
  }
}; 