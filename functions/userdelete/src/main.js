import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

  log('this is req.body:', req.body);

  const users = new Users(client);

  try {
    if (!req.body) {
      throw new Error('Request body is missing.');
    }

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log('this is data:', data);
    log('this is data.$id:', data.$id);

    if (!data.$id) {
      throw new Error('ID not provided.');
    }

    const user = await users.get(data.$id);

    console.log('User info:', user);

  } catch (err) {
    error("Could not delete user: " + err);
  }
  return res.json({ msg: 'User deleted from Appwrite.' });
}; 