import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SearchBar } from "@/components/SearchBar";
import { TutorCard } from "@/components/TutorCard";
import { useColors } from "@/hooks/useColors";
import { TUTORS } from "@/lib/data";

const SUBJECTS = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics"];
const MODES = ["All", "Online", "Home Tuition", "Centre"];

function StatPill({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function TutorsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [mode, setMode] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const filtered = useMemo(() => {
    return TUTORS.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        t.location.toLowerCase().includes(search.toLowerCase());
      const matchSubject = subject === "All" || t.subjects.includes(subject);
      const matchMode = mode === "All" || t.mode.includes(mode);
      return matchSearch && matchSubject && matchMode;
    });
  }, [search, subject, mode]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: topPad + 10,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Tutors</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Connect with verified expert tutors
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TutorCard tutor={item} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={{ gap: 12, paddingTop: 16 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, subject..."
            />

            {/* Stats */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
              <StatPill icon="person-outline" value="500+" label="Tutors" color={colors.primary} />
              <StatPill icon="people-outline" value="10K+" label="Students" color={colors.secondary} />
              <StatPill icon="star-outline" value="4.9★" label="Avg Rating" color="#F59E0B" />
              <StatPill icon="trophy-outline" value="95%" label="Success" color="#10B981" />
            </ScrollView>

            {/* Subject Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {SUBJECTS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSubject(s)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: subject === s ? colors.primary : colors.card,
                      borderColor: subject === s ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: subject === s ? "#fff" : colors.mutedForeground }]}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Mode Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {MODES.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: mode === m ? colors.secondary : colors.card,
                      borderColor: mode === m ? colors.secondary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: mode === m ? "#fff" : colors.mutedForeground }]}>
                    {m}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {filtered.length} tutors found
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="person-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No tutors found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different subject or location
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.7,
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    gap: 10,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  chips: { gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
