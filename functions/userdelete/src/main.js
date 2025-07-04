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

    if (!data.$id) {
      throw new Error('ID not provided.');
    }

    const user = await users.get(data.$id);

    console.log('User info:', user);

    // await users.delete(data.$id);

    // log(`User deleted successfully.`);

  } catch (err) {
    error("Could not delete AUTH user: " + err.message);
  }
  return res.json({ msg: 'User deleted from Appwrite.' });
}; 