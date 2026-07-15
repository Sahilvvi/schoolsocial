import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
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

import { SchoolCard } from "@/components/SchoolCard";
import { SearchBar } from "@/components/SearchBar";
import { useColors } from "@/hooks/useColors";
import { SCHOOLS } from "@/lib/data";

const BOARDS = ["All", "CBSE", "ICSE", "IB/IGCSE", "State Board"];
const TYPES = ["All", "Private", "Government"];

export default function SchoolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [board, setBoard] = useState("All");
  const [type, setType] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const filtered = useMemo(() => {
    return SCHOOLS.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase());
      const matchBoard = board === "All" || s.board === board;
      const matchType = type === "All" || s.type === type;
      return matchSearch && matchBoard && matchType;
    });
  }, [search, board, type]);

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
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Schools</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {filtered.length} results found
          </Text>
        </View>
        <Pressable
          style={[styles.compareShortcut, { backgroundColor: colors.accent, borderColor: colors.primary + "30" }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/compare" as any);
          }}
        >
          <Ionicons name="git-compare-outline" size={15} color={colors.primary} />
          <Text style={[styles.compareShortcutText, { color: colors.primary }]}>Compare</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <SchoolCard school={item} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.filters}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search schools, location..."
              filterIcon
            />

            {/* Board Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {BOARDS.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => setBoard(b)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: board === b ? colors.primary : colors.card,
                      borderColor: board === b ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: board === b ? "#fff" : colors.mutedForeground,
                      },
                    ]}
                  >
                    {b}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Type Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {TYPES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: type === t ? colors.secondary : colors.card,
                      borderColor: type === t ? colors.secondary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: type === t ? "#fff" : colors.mutedForeground,
                      },
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="school-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No schools found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try adjusting your filters or search term
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  compareShortcut: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  compareShortcutText: { fontSize: 13, fontWeight: "700" as const },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.7,
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  filters: {
    paddingTop: 16,
    gap: 10,
  },
  chips: {
    gap: 8,
    paddingHorizontal: 0,
  },
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
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
