import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SCHOOLS } from "@/lib/data";

const SAVED_IDS = ["1", "2", "3", "6", "4", "5", "8"];

export default function SavedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [savedIds, setSavedIds] = useState<string[]>(SAVED_IDS);

  const savedSchools = SCHOOLS.filter((s) => savedIds.includes(s.id));

  const removeSchool = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSavedIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Saved Schools</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {savedSchools.length} {savedSchools.length === 1 ? "school" : "schools"} saved
          </Text>
        </View>
        {savedSchools.length >= 2 && (
          <Pressable
            style={[styles.compareBtn, { backgroundColor: colors.accent, borderColor: colors.primary + "30" }]}
            onPress={() => router.push("/compare" as any)}
          >
            <Ionicons name="git-compare-outline" size={14} color={colors.primary} />
            <Text style={[styles.compareBtnText, { color: colors.primary }]}>Compare</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={savedSchools}
        keyExtractor={(s) => s.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
              <Ionicons name="heart-outline" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No saved schools</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Browse schools and tap the heart icon to save them here
            </Text>
            <Pressable
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/schools" as any)}
            >
              <Text style={styles.browseBtnText}>Browse Schools</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable
              style={styles.cardMain}
              onPress={() => router.push(`/school/${item.id}` as any)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={[styles.boardBadge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.boardText, { color: colors.primary }]}>{item.board}</Text>
                  </View>
                  {item.isVerified && (
                    <View style={styles.verifiedRow}>
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                      <Text style={[styles.verifiedText, { color: "#10B981" }]}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.locationText, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={[styles.rating, { color: colors.foreground }]}>{item.rating}</Text>
                    <Text style={[styles.reviews, { color: colors.mutedForeground }]}>({item.reviewCount})</Text>
                  </View>
                  <Text style={[styles.fees, { color: colors.primary }]}>{item.fees}</Text>
                </View>
              </View>
            </Pressable>

            {/* Actions */}
            <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.actionBtn, { borderColor: "#EF444430" }]}
                onPress={() => removeSchool(item.id)}
              >
                <Ionicons name="heart" size={15} color="#EF4444" />
                <Text style={[styles.actionBtnText, { color: "#EF4444" }]}>Remove</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, { borderColor: colors.border }]}
                onPress={() => router.push(`/school/${item.id}` as any)}
              >
                <Ionicons name="eye-outline" size={15} color={colors.mutedForeground} />
                <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>View</Text>
              </Pressable>
              <Pressable
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push(`/school/${item.id}` as any)}
              >
                <Text style={styles.applyBtnText}>Apply Now</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { marginTop: 2, padding: 2 },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  compareBtnText: { fontSize: 13, fontWeight: "700" as const },

  list: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardMain: { flexDirection: "row" },
  cardImage: { width: 110, height: 120 },
  cardBody: { flex: 1, padding: 12, gap: 5 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  boardBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  boardText: { fontSize: 10, fontWeight: "700" as const },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  verifiedText: { fontSize: 10, fontWeight: "600" as const },
  cardName: { fontSize: 14, fontWeight: "700" as const, lineHeight: 19 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: { fontSize: 11, flex: 1 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 12, fontWeight: "700" as const },
  reviews: { fontSize: 11 },
  fees: { fontSize: 12, fontWeight: "700" as const },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },
  actionBtnText: { fontSize: 12, fontWeight: "600" as const },
  applyBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 7,
    borderRadius: 9,
  },
  applyBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" as const },

  empty: { alignItems: "center", paddingTop: 80, gap: 12, paddingHorizontal: 40 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, fontWeight: "800" as const },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  browseBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, marginTop: 4 },
  browseBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
});
