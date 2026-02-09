import pgtools from 'pgtools';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './env.config';

pgtools
  .createdb(
    {
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: Number(DB_PORT),
    },
    DB_NAME!,
  )
  .then(() => {
    console.log('DB created');
  })
  .catch(() => {
    console.log('Error while DB creation');
  });
