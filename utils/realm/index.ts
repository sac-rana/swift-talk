import { Group, Message } from './schema';
import { createRealmContext } from '@realm/react';

export const RealmContext = createRealmContext({
  schema: [Message, Group],
  deleteRealmIfMigrationNeeded: true,
});
