import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { TUTORS } from "@/lib/data";

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
};

export default function TutorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showBook, setShowBook] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const tutor = TUTORS.find((t) => t.id === id);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const accentColor = tutor ? (SUBJECT_COLORS[tutor.subjects[0]] ?? "#2563EB") : "#2563EB";

  if (!tutor) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="person-outline" size={48} color={colors.mutedForeground} />
        <Text style={[{ fontSize: 18, fontWeight: "700" as const, color: colors.foreground }]}>Tutor not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" as const }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleBook = () => {
    if (!name || !email) {
      Alert.alert("Missing Info", "Please enter your name and email.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowBook(false);
    Alert.alert(
      "Booking Confirmed!",
      `Your booking request has been sent to ${tutor.name}. They will contact you at ${email} within 24 hours.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: accentColor, paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: tutor.avatar }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.tutorName}>{tutor.name}</Text>
            <Text style={styles.tutorSubjects}>{tutor.subjects.join(" • ")}</Text>
            <Text style={styles.tutorQuals} numberOfLines={1}>{tutor.qualifications}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { icon: "star", value: tutor.rating.toString(), label: `(${tutor.reviewCount})`, color: "#FCD34D" },
            { icon: "time-outline", value: `${tutor.experience}yr`, label: "Exp.", color: "rgba(255,255,255,0.9)" },
            { icon: "people-outline", value: tutor.studentsCount.toString(), label: "Students", color: "rgba(255,255,255,0.9)" },
            { icon: "trophy-outline", value: `${tutor.successRate}%`, label: "Success", color: "#6EE7B7" },
          ].map((s, i) => (
            <View key={i} style={styles.stat}>
              <Ionicons name={s.icon as any} size={16} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 100, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {/* About */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>About</Text>
          <Text style={[styles.cardText, { color: colors.mutedForeground }]}>{tutor.bio}</Text>
        </View>

        {/* Details */}
        {[
          { icon: "location-outline", label: "Location", value: tutor.location },
          { icon: "language-outline", label: "Languages", value: tutor.languages.join(", ") },
          { icon: "cash-outline", label: "Rate", value: `₹${tutor.hourlyRate} per hour` },
        ].map((row) => (
          <View key={row.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Ionicons name={row.icon as any} size={16} color={accentColor} />
            <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
            <Text style={[styles.detailValue, { color: colors.foreground }]}>{row.value}</Text>
          </View>
        ))}

        {/* Teaching modes */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Teaching Modes</Text>
          <View style={styles.modes}>
            {tutor.mode.map((m) => (
              <View key={m} style={[styles.modePill, { backgroundColor: accentColor + "15", borderColor: accentColor + "40" }]}>
                <Ionicons
                  name={m === "Online" ? "videocam-outline" : m === "Home Tuition" ? "home-outline" : "business-outline"}
                  size={14}
                  color={accentColor}
                />
                <Text style={[styles.modeText, { color: accentColor }]}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subjects */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Subjects</Text>
          <View style={styles.modes}>
            {tutor.subjects.map((s) => (
              <View key={s} style={[styles.subjectPill, { backgroundColor: (SUBJECT_COLORS[s] ?? accentColor) + "18" }]}>
                <Text style={[styles.subjectText, { color: SUBJECT_COLORS[s] ?? accentColor }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Now */}
      {!showBook ? (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
          <View>
            <Text style={[styles.rateLabel, { color: colors.mutedForeground }]}>Per Hour</Text>
            <Text style={[styles.rateValue, { color: colors.primary }]}>₹{tutor.hourlyRate}</Text>
          </View>
          <Pressable
            style={[styles.bookBtn, { backgroundColor: accentColor }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowBook(true);
            }}
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.bookBtnText}>Book Now</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.bookForm, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
          <View style={styles.bookFormHeader}>
            <Text style={[styles.bookFormTitle, { color: colors.foreground }]}>Book {tutor.name}</Text>
            <Pressable onPress={() => setShowBook(false)}>
              <Ionicons name="close" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>
          {[
            { placeholder: "Your Name", value: name, setter: setName, key: "default" as const },
            { placeholder: "Email Address", value: email, setter: setEmail, key: "email-address" as const },
          ].map((f) => (
            <View key={f.placeholder} style={[styles.bookInput, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <TextInput
                style={{ color: colors.foreground, flex: 1, fontSize: 14, padding: 0 }}
                placeholder={f.placeholder}
                placeholderTextColor={colors.mutedForeground}
                value={f.value}
                onChangeText={f.setter}
                keyboardType={f.key}
                autoCapitalize="none"
              />
            </View>
          ))}
          <View style={[styles.bookInput, { backgroundColor: colors.muted, borderColor: colors.border, height: 70 }]}>
            <TextInput
              style={{ color: colors.foreground, flex: 1, fontSize: 14, padding: 0, textAlignVertical: "top" }}
              placeholder="Message (optional)"
              placeholderTextColor={colors.mutedForeground}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />
          </View>
          <Pressable style={[styles.bookBtn, { backgroundColor: accentColor }]} onPress={handleBook}>
            <Text style={styles.bookBtnText}>Confirm Booking</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileRow: { flexDirection: "row", gap: 14, alignItems: "center", marginBottom: 16 },
  avatarContainer: { position: "relative" },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: "rgba(255,255,255,0.4)" },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: { flex: 1, gap: 3 },
  tutorName: { color: "#fff", fontSize: 20, fontWeight: "800" as const, letterSpacing: -0.4 },
  tutorSubjects: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "600" as const },
  tutorQuals: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  statsRow: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 14, padding: 10 },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { color: "#fff", fontSize: 14, fontWeight: "800" as const },
  statLabel: { color: "rgba(255,255,255,0.75)", fontSize: 10 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700" as const },
  cardText: { fontSize: 14, lineHeight: 21 },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  detailLabel: { fontSize: 13, width: 90 },
  detailValue: { fontSize: 13, fontWeight: "600" as const, flex: 1 },
  modes: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  modePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  modeText: { fontSize: 13, fontWeight: "600" as const },
  subjectPill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  subjectText: { fontSize: 13, fontWeight: "600" as const },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
  rateLabel: { fontSize: 12 },
  rateValue: { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.5 },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
  bookForm: { padding: 16, gap: 10, borderTopWidth: 1 },
  bookFormHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bookFormTitle: { fontSize: 16, fontWeight: "700" as const },
  bookInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
});
