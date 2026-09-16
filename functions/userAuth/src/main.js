import { Client, Users, Account, Query, TablesDB } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

   log('Hello');  

    return res.json({ message: 'Successful.' });
  } catch (err) {
    error('Failed: ' + err.message);
  
  }
};