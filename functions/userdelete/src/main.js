import { Client, Users, Account, Query, TablesDB } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const jwtClient = new Client()
    .setEndpoint(process.env.ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setJWT(req.headers['x-appwrite-user-jwt']);

  const adminClient = new Client()
    .setEndpoint(process.env.ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const account = new Account(jwtClient);

  const tablesDB = new TablesDB(adminClient);
  const users = new Users(adminClient);

  try {

    const usrAccnt = await account.get();

    if (!req.body) throw new Error('Missing request body');

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // incoming user id from the jwtClient-side
    const userId = data?.user_id;

    log('id from client side:', userId);
    log('id from jwt:', usrAccnt.$id);

    if (usrAccnt.$id !== userId) {
      return res.json({ success: false, message: 'Error deleting account. Please try again later or contact support.' });
    }

    if (!userId) {
      throw new Error('Missing user ID in request')
    };

    const user = await users.get(usrAccnt.$id);

    const verfiedUserId = user.$id;
    const prefUID = user.prefs?.profile_id;

    log('user:', user);
    log('verfiedUserId:', verfiedUserId);
    log('prefUID:', prefUID);

    if (verfiedUserId) {
      await Promise.all([
        tablesDB.deleteRows({
          databaseId: process.env.DATABASE_ID,
          tableId: process.env.SAVES_COLLECTION,
          queries: [Query.equal('user_id', verfiedUserId)]
        }),

        tablesDB.deleteRow({
          databaseId: process.env.DATABASE_ID,
          tableId: process.env.USERNAMES_COLLECTION,
          rowId: verfiedUserId
        })
      ]);
    }

    await users.delete({
      userId: usrAccnt.$id
    });

    return res.json({ success: true, deletedProfileId: prefUID });
  } catch (err) {
    error('Failed to delete user: ' + err.message);
    return res.json({ success: false, error: err.message });
  }
};