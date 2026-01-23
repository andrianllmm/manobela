import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { sessions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDatabase } from '@/components/database-provider';
import { useRouter } from 'expo-router';
import { useInsightRefresh } from '@/hooks/useInsightsRefresh';

export default function InsightsScreen() {
  const db = useDatabase();
  const router = useRouter();
  const { tick } = useInsightRefresh();

  const { data: sessionList = [] } = useLiveQuery(
    db.select().from(sessions).orderBy(desc(sessions.startedAt)),
    [tick]
  );

  return (
    <FlatList
      data={sessionList}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={
        <View className="px-3 py-2">
          <Text className="mb-4 text-lg font-bold">Insights</Text>

          {sessionList.length === 0 && (
            <Text className="py-2 text-center text-sm text-muted">No sessions found.</Text>
          )}
        </View>
      }
      renderItem={({ item: session }) => (
        <TouchableOpacity
          onPress={() => router.push(`/insights/session/${session.id}`)}
          activeOpacity={0.8}
          className="mx-3 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>{new Date(session.startedAt).toLocaleString()}</CardDescription>
            </CardHeader>

            <CardContent>
              <Text>ID: {session.id}</Text>
              <Text>Client: {session.clientId}</Text>
              <Text>
                End:{' '}
                {session.endedAt ? new Date(session.endedAt).toLocaleString() : 'Still running'}
              </Text>
              <Text>Duration: {session.durationMs ?? '-'} ms</Text>
            </CardContent>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}
