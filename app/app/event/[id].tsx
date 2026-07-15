import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { EVENTS } from "@/lib/data";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const event = EVENTS.find((e) => e.id === id);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!event) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Event not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" as const }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const day = event.date.split(" ")[1]?.replace(",", "") ?? "25";
  const month = event.date.split(" ")[0]?.slice(0, 3).toUpperCase() ?? "MAY";

  const handleRegister = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Registration Successful!",
      `You have registered for ${event.title}. Check your email for confirmation details.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <Pressable
          style={[styles.backBtn, { top: (Platform.OS === "web" ? 67 : insets.top) + 10 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <View style={[styles.dateBubble, { top: (Platform.OS === "web" ? 67 : insets.top) + 10 }]}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.catBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.catText, { color: colors.primary }]}>{event.category}</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>{event.title}</Text>
        <Text style={[styles.school, { color: colors.mutedForeground }]}>{event.school}</Text>

        {/* Info cards */}
        <View style={styles.infoGrid}>
          {[
            { icon: "calendar-outline", label: "Date", value: event.date },
            { icon: "time-outline", label: "Time", value: event.time },
            { icon: "location-outline", label: "Venue", value: event.location },
            { icon: "people-outline", label: "Seats Left", value: `${event.seatsLeft} / ${event.seats}` },
          ].map((info) => (
            <View key={info.label} style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={info.icon as any} size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{info.label}</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={2}>
                {info.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Seats progress */}
        <View style={[styles.seatsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.seatsHeader}>
            <Text style={[styles.seatsTitle, { color: colors.foreground }]}>Available Seats</Text>
            <Text style={[styles.seatsCount, { color: event.seatsLeft < 50 ? "#EF4444" : colors.primary }]}>
              {event.seatsLeft} left
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: event.seatsLeft < 50 ? "#EF4444" : colors.primary,
                  width: `${(event.seatsLeft / event.seats) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.seatsNote, { color: colors.mutedForeground }]}>
            {Math.round(((event.seats - event.seatsLeft) / event.seats) * 100)}% seats filled
          </Text>
        </View>

        {/* Description */}
        <View style={[styles.descCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.descTitle, { color: colors.foreground }]}>About this Event</Text>
          <Text style={[styles.descText, { color: colors.mutedForeground }]}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Register button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
        <Pressable
          style={[styles.registerBtn, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.registerBtnText}>Register Now — Free</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: "700" as const },
  imageContainer: { position: "relative" },
  heroImage: { width: "100%", height: 240 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateBubble: {
    position: "absolute",
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: { color: "#fff", fontSize: 20, fontWeight: "800" as const, lineHeight: 22 },
  dateMonth: { color: "rgba(255,255,255,0.85)", fontSize: 9, fontWeight: "600" as const, letterSpacing: 0.5 },
  catBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, alignSelf: "flex-start" },
  catText: { fontSize: 12, fontWeight: "700" as const, letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.6, lineHeight: 30 },
  school: { fontSize: 14, marginTop: -8 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  infoCard: {
    width: "47%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  infoLabel: { fontSize: 11, fontWeight: "600" as const },
  infoValue: { fontSize: 14, fontWeight: "700" as const },
  seatsCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  seatsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  seatsTitle: { fontSize: 15, fontWeight: "700" as const },
  seatsCount: { fontSize: 15, fontWeight: "700" as const },
  progressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  seatsNote: { fontSize: 12 },
  descCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  descTitle: { fontSize: 16, fontWeight: "700" as const },
  descText: { fontSize: 14, lineHeight: 22 },
  bottomBar: { padding: 16, borderTopWidth: 1 },
  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  registerBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
});
