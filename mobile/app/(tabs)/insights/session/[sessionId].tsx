import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { metrics, sessions } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDatabase } from '@/components/database-provider';
import { useLocalSearchParams, Stack } from 'expo-router';
import { desc, eq } from 'drizzle-orm';

import { EarTrendChart } from '@/components/charts/ear-trend';
import { MarTrendChart } from '@/components/charts/mar-trend';

export default function SessionDetailsScreen() {
  const { db } = useDatabase();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  const { data: sessionList } = useLiveQuery(
    db.select().from(sessions).where(eq(sessions.id, sessionId)),
    [sessionId]
  );

  const session = sessionList?.[0];

  const { data: sessionMetrics = [] } = useLiveQuery(
    db
      .select()
      .from(metrics)
      .where(eq(metrics.sessionId, sessionId))
      .orderBy(desc(metrics.timestamp)),
    [sessionId]
  );

  const earValues = useMemo(() => {
    const sorted = [...sessionMetrics].sort((a, b) => a.timestamp - b.timestamp);
    return sorted
      .map((m) => (typeof m.ear === 'number' && !isNaN(m.ear) ? m.ear : null))
      .filter((v) => v !== null) as number[];
  }, [sessionMetrics]);

  const marValues = useMemo(() => {
    const sorted = [...sessionMetrics].sort((a, b) => a.timestamp - b.timestamp);
    return sorted
      .map((m) => (typeof m.mar === 'number' && !isNaN(m.mar) ? m.mar : null))
      .filter((v) => v !== null) as number[];
  }, [sessionMetrics]);

  const HeaderComponent = () => (
    <>
      {session ? (
        <View className="mb-4">
          <Text className="text-sm font-semibold">
            {session ? (
              <>
                {new Date(session.startedAt).toLocaleDateString()}
                {' | '}
                {new Date(session.startedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
                {' to '}
                {session.endedAt
                  ? new Date(session.endedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : 'now'}
              </>
            ) : (
              '-'
            )}
          </Text>

          <Text className="text-sm text-muted-foreground">
            Duration:{' '}
            {session.durationMs != null
              ? new Date(session.durationMs).toISOString().slice(14, 19)
              : '-'}
          </Text>
          <Text className="text-sm text-muted-foreground">Client ID: {session.clientId}</Text>
        </View>
      ) : (
        <Text className="text-sm text-muted-foreground">Session not found.</Text>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Eye Openness Trend</CardTitle>
          <CardDescription>Lower values may indicate fatigue.</CardDescription>
          <Text className="text-xs text-muted-foreground">Based on Eye Aspect Ratio (EAR).</Text>
        </CardHeader>
        <CardContent>
          <EarTrendChart data={earValues} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Yawning Trend</CardTitle>
          <CardDescription>Spikes in values may indicate yawning.</CardDescription>
          <Text className="text-xs text-muted-foreground">Based on Mouth Aspect Ratio (MAR).</Text>
        </CardHeader>
        <CardContent>
          <MarTrendChart data={marValues} />
        </CardContent>
      </Card>

      <Text className="mb-2 font-semibold">Metrics</Text>
    </>
  );

  return (
    <View className="flex-1 px-3 py-4">
      <Stack.Screen options={{ title: 'Session Details' }} />

      <FlatList
        data={sessionMetrics}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={HeaderComponent}
        renderItem={({ item: m }) => (
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Metric</CardTitle>
              <CardDescription>{new Date(m.timestamp).toLocaleTimeString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>EAR: {m.ear}</Text>
              <Text>MAR: {m.mar}</Text>
              <Text>Yaw: {m.yaw}</Text>
              <Text>Pitch: {m.pitch}</Text>
              <Text>Roll: {m.roll}</Text>
              <Text>Perclos: {m.perclos}</Text>
              <Text>Phone Usage: {m.phoneUsage ? 'true' : 'false'}</Text>
            </CardContent>
          </Card>
        )}
        ListEmptyComponent={
          <Text className="text-sm text-gray-500">No metrics recorded for this session.</Text>
        }
      />
    </View>
  );
}
