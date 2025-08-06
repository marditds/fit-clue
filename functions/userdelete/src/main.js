import { Client, Users, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const users = new Users(client);
  const databases = new Databases(client);

  try {
    if (!req.body) throw new Error('Missing request body');

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const userId = data?.$id;

    log('userId:', userId);

    if (!userId) {
      throw new Error('Missing user ID in request')
    };

    const user = await users.get(userId);

    log('user:', user);

    const profileId = user.prefs?.profile_id;

    log('profileId:', profileId);

    await users.delete(userId);

    if (profileId) {
      await Promise.all([
        databases.deleteDocuments(
          process.env.VITE_DATABASE_ID,
          process.env.VITE_SAVES_COLLECTION,
          [Query.equal('user_id', profileId)]
        ),

        databases.deleteDocument(
          process.env.VITE_DATABASE_ID,
          process.env.VITE_USERNAMES_COLLECTION,
          profileId
        )
      ]);
    }

    return res.json({ success: true, deletedProfileId: profileId });
  } catch (err) {
    error('Failed to delete user: ' + err.message);
    return res.json({ success: false, error: err.message });
  }
};