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
import type { Event } from "@/lib/data";
import { useColors } from "@/hooks/useColors";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Sports: { bg: "#EFF6FF", text: "#2563EB" },
  Admission: { bg: "#F5F3FF", text: "#7C3AED" },
  Academic: { bg: "#ECFDF5", text: "#059669" },
  Cultural: { bg: "#FFF7ED", text: "#EA580C" },
  Default: { bg: "#F1F5F9", text: "#64748B" },
};

interface Props {
  event: Event;
  featured?: boolean;
}

export function EventCard({ event, featured = false }: Props) {
  const colors = useColors();
  const router = useRouter();
  const catStyle = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.Default;

  const dateObj = new Date(event.date);
  const day = dateObj.getDate() || event.date.split(" ")[1]?.replace(",", "") || "25";
  const month = event.date.split(" ")[0]?.slice(0, 3).toUpperCase() || "MAY";

  if (featured) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.featured,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
        onPress={() => router.push(`/event/${event.id}`)}
      >
        <Image source={{ uri: event.image }} style={styles.featuredImage} resizeMode="cover" />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredDateBox}>
          <Text style={styles.featuredDay}>{day}</Text>
          <Text style={styles.featuredMonth}>{month}</Text>
        </View>
        <View style={[styles.featuredBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.featuredBadgeText}>FEATURED</Text>
        </View>
        <View style={styles.featuredBody}>
          <View style={[styles.catBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.catTextLight}>{event.category}</Text>
          </View>
          <Text style={styles.featuredTitle} numberOfLines={2}>{event.title}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.infoTextLight} numberOfLines={1}>{event.location}</Text>
          </View>
          <View style={styles.seatRow}>
            <View style={styles.seatBadge}>
              <Text style={styles.seatText}>{event.seatsLeft} seats left</Text>
            </View>
            <Text style={styles.registerText}>Register →</Text>
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
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
      <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.catText, { color: catStyle.text }]}>{event.category}</Text>
          </View>
          {event.seatsLeft < 50 && (
            <View style={[styles.urgentBadge, { backgroundColor: "#FEF2F2" }]}>
              <Text style={{ color: "#EF4444", fontSize: 10, fontWeight: "700" as const }}>
                Only {event.seatsLeft} left
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]} numberOfLines={1}>
            {event.school}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            {event.time} · {event.date}
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
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 140,
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800" as const,
    lineHeight: 18,
  },
  dateMonth: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 9,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  body: {
    padding: 12,
    gap: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  catTextLight: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.9)",
  },
  urgentBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  infoTextLight: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
  },

  // Featured card
  featured: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  featuredImage: {
    width: "100%",
    height: 240,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  featuredDateBox: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredDay: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800" as const,
    lineHeight: 22,
  },
  featuredMonth: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 9,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  featuredBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
  featuredBody: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    gap: 6,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  seatBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seatText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  registerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700" as const,
  },
});
