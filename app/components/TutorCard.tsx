import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Tutor } from "@/lib/data";
import { useColors } from "@/hooks/useColors";

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#2563EB",
  Physics: "#7C3AED",
  Chemistry: "#10B981",
  Biology: "#EF4444",
  English: "#F59E0B",
  History: "#F97316",
  Science: "#06B6D4",
  Economics: "#8B5CF6",
  "Computer Science": "#0EA5E9",
  "Business Studies": "#84CC16",
};

interface Props {
  tutor: Tutor;
  compact?: boolean;
}

export function TutorCard({ tutor, compact = false }: Props) {
  const colors = useColors();
  const router = useRouter();
  const mainSubject = tutor.subjects[0];
  const accentColor = SUBJECT_COLORS[mainSubject] ?? colors.primary;

  if (compact) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.compact,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        onPress={() => router.push(`/tutor/${tutor.id}`)}
      >
        <View style={[styles.compactAccent, { backgroundColor: accentColor }]} />
        <View style={styles.compactInner}>
          <Image source={{ uri: tutor.avatar }} style={styles.compactAvatar} />
          <View style={styles.compactBody}>
            <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>
              {tutor.name}
            </Text>
            <Text style={[styles.compactSubject, { color: accentColor }]} numberOfLines={1}>
              {tutor.subjects.join(" • ")}
            </Text>
            <View style={styles.compactBottom}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: colors.foreground }]}>
                  {tutor.rating}
                </Text>
              </View>
              <Text style={[styles.rate, { color: colors.primary }]}>
                ₹{tutor.hourlyRate}/hr
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.93 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
      onPress={() => router.push(`/tutor/${tutor.id}`)}
    >
      <View style={[styles.colorBar, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: tutor.avatar }} style={styles.avatar} />
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
              <Ionicons name="checkmark" size={9} color="#fff" />
            </View>
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
              {tutor.name}
            </Text>
            <Text style={[styles.subjects, { color: accentColor }]} numberOfLines={1}>
              {tutor.subjects.join(" • ")}
            </Text>
            <Text style={[styles.quals, { color: colors.mutedForeground }]} numberOfLines={1}>
              {tutor.qualifications}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {tutor.rating}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              ({tutor.reviewCount})
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {tutor.experience}yr
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={13} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {tutor.successRate}%
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.modes}>
            {tutor.mode.map((m) => (
              <View
                key={m}
                style={[styles.modeBadge, { backgroundColor: colors.muted }]}
              >
                <Text style={[styles.modeText, { color: colors.mutedForeground }]}>{m}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.rate, { color: colors.primary }]}>
            ₹{tutor.hourlyRate}/hr
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  colorBar: {
    height: 4,
    width: "100%",
  },
  body: {
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  subjects: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  quals: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modes: {
    flexDirection: "row",
    gap: 6,
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeText: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  rate: {
    fontSize: 15,
    fontWeight: "700" as const,
  },

  // Compact card
  compact: {
    width: 230,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  compactAccent: {
    height: 3,
  },
  compactInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  compactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  compactBody: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
  },
  compactSubject: {
    fontSize: 12,
    fontWeight: "600" as const,
    marginVertical: 2,
  },
  compactBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
});
