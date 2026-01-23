import React, { createContext, useContext } from 'react';
import { db } from '@/db/client';
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

const DatabaseContext = createContext(db);

/**
 * Provides a database instance and runs migrations.
 */
export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View>
        <Text>Migration failed: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migrating database…</Text>
      </View>
    );
  }

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => useContext(DatabaseContext);
