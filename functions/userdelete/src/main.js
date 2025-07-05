import { Client, Users, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);
  const databases = new Databases(client);

  log(req.userId);

  try {
    const userId = req.userId;

    if (!userId) {
      throw new Error('Unauthorized. No user ID found in request context.');
    }

    const user = await users.get(userId);

    log(user);

    const profileId = user.prefs?.profile_id;

    log(profileId);

    // await users.delete(userId);

    // if (profileId) {
    //   await databases.deleteDocument(
    //     process.env.VITE_DATABASE_ID,
    //     process.env.VITE_USERNAMES_COLLECTION,
    //     profileId
    //   );
    // }

    log(`Deleted user ${userId} and profile ${profileId}`);
    return res.json({ success: true, userId, profileId });
  } catch (err) {
    error('Deletion error: ' + err.message);
    return res.json({ success: false, error: err.message });
  }
};