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
import type { School } from "@/lib/data";
import { useColors } from "@/hooks/useColors";

interface Props {
  school: School;
  horizontal?: boolean;
}

export function SchoolCard({ school, horizontal = false }: Props) {
  const colors = useColors();
  const router = useRouter();

  if (horizontal) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.horizontal,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={() => router.push(`/school/${school.id}`)}
      >
        <Image
          source={{ uri: school.image }}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalBody}>
          <View style={styles.headerRow}>
            <View style={[styles.boardBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.boardText, { color: colors.primary }]}>{school.board}</Text>
            </View>
            {school.isVerified && (
              <Ionicons name="checkmark-circle" size={15} color={colors.success} />
            )}
          </View>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {school.name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
            <Text style={[styles.location, { color: colors.mutedForeground }]}>
              {school.location}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={[styles.rating, { color: colors.foreground }]}>
                {school.rating}
              </Text>
              <Text style={[styles.reviews, { color: colors.mutedForeground }]}>
                ({school.reviewCount})
              </Text>
            </View>
            <Text style={[styles.fee, { color: colors.primary }]}>{school.fees}</Text>
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
      onPress={() => router.push(`/school/${school.id}`)}
    >
      <Image
        source={{ uri: school.image }}
        style={styles.image}
        resizeMode="cover"
      />
      {school.isFeatured && (
        <View style={[styles.featuredBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>
      )}
      <View style={[styles.body, { backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <View style={[styles.boardBadge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.boardText, { color: colors.primary }]}>{school.board}</Text>
          </View>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={[styles.ratingPillText, { color: colors.foreground }]}>
              {school.rating}
            </Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {school.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
          <Text style={[styles.location, { color: colors.mutedForeground }]}>
            {school.location}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={13} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {school.students.toLocaleString()} Students
            </Text>
          </View>
          <Text style={[styles.fee, { color: colors.primary }]}>{school.fees}</Text>
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
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 160,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  boardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  boardText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingPillText: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  fee: {
    fontSize: 14,
    fontWeight: "700" as const,
  },

  // Horizontal card
  horizontal: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    width: 300,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  horizontalImage: {
    width: 100,
    height: "100%",
  },
  horizontalBody: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  reviews: {
    fontSize: 11,
  },
});
