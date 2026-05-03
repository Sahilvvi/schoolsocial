import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
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

const BATCH_FILTERS = ["All Classes", "Primary (1-5)", "Middle (6-8)", "High School (9-10)", "Senior (11-12)"];
const MODES = ["All", "Offline", "Online", "Hybrid"];

const CENTERS = [
  {
    id: "tc1",
    name: "Bright Future Tuition Center",
    rating: 4.7,
    reviews: 98,
    location: "Loni, Ghaziabad",
    classes: "Class 1–12",
    boards: "CBSE, ICSE, State",
    subjects: "All Subjects",
    teachers: "6+",
    fee: "₹1,500–₹2,500/mo",
    mode: "Offline",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
    established: "2018",
    batchSize: "10-15",
    tags: ["Board Exam Focus", "Doubt Classes", "Test Series"],
    color: "#2563EB",
  },
  {
    id: "tc2",
    name: "Excel Academy",
    rating: 4.5,
    reviews: 143,
    location: "Mohan Nagar, Ghaziabad",
    classes: "Class 6–12",
    boards: "CBSE, State Board",
    subjects: "Maths, Science, English",
    teachers: "10+",
    fee: "₹1,200–₹2,000/mo",
    mode: "Hybrid",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    established: "2015",
    batchSize: "12-18",
    tags: ["IIT-JEE Prep", "NEET Prep", "Scholarship Tests"],
    color: "#7C3AED",
  },
  {
    id: "tc3",
    name: "Gyan Jyoti Coaching Centre",
    rating: 4.3,
    reviews: 67,
    location: "Dilshad Garden, Delhi",
    classes: "Class 1–10",
    boards: "All Boards",
    subjects: "All Subjects",
    teachers: "4+",
    fee: "₹800–₹1,500/mo",
    mode: "Offline",
    isVerified: false,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
    established: "2019",
    batchSize: "8-12",
    tags: ["Affordable", "Weekend Batches", "Personalised Attention"],
    color: "#10B981",
  },
  {
    id: "tc4",
    name: "Smart Learning Hub",
    rating: 4.8,
    reviews: 210,
    location: "Vasundhara, Ghaziabad",
    classes: "Class 8–12",
    boards: "CBSE, ICSE, IB",
    subjects: "Maths, Physics, Chemistry",
    teachers: "15+",
    fee: "₹2,500–₹4,000/mo",
    mode: "Online",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
    established: "2016",
    batchSize: "6-10",
    tags: ["Live Online Classes", "Recorded Lectures", "24/7 Doubt Support"],
    color: "#F59E0B",
  },
  {
    id: "tc5",
    name: "Rising Stars Institute",
    rating: 4.4,
    reviews: 89,
    location: "Rajnagar, Ghaziabad",
    classes: "Class 1–8",
    boards: "CBSE, State Board",
    subjects: "All Subjects",
    teachers: "8+",
    fee: "₹900–₹1,800/mo",
    mode: "Offline",
    isVerified: false,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    established: "2020",
    batchSize: "10-15",
    tags: ["Morning Batches", "Evening Batches", "Home Pickup"],
    color: "#EF4444",
  },
];

const MODE_COLORS: Record<string, { bg: string; text: string }> = {
  Offline: { bg: "#EFF6FF", text: "#2563EB" },
  Online: { bg: "#ECFDF5", text: "#10B981" },
  Hybrid: { bg: "#F5F3FF", text: "#7C3AED" },
};

export default function TuitionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = useMemo(() =>
    CENTERS.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
      const matchMode = mode === "All" || c.mode === mode;
      return matchSearch && matchMode;
    }),
    [search, mode]
  );

  const handleEnquire = (centerName: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Enquiry Sent!",
      `Your enquiry for ${centerName} has been submitted. They will contact you within 24 hours.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Tuition Centers</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {filtered.length} coaching centers found
          </Text>
        </View>
      </View>

      {/* Stats strip */}
      <View style={[styles.statsStrip, { backgroundColor: colors.muted }]}>
        {[
          { value: "300+", label: "Centers", color: "#2563EB" },
          { value: "50K+", label: "Students", color: "#7C3AED" },
          { value: "4.6★", label: "Avg Rating", color: "#F59E0B" },
          { value: "₹800+", label: "Min Fee", color: "#10B981" },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 100 }]}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Search */}
            <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.searchPlaceholder, { color: colors.mutedForeground }]}>
                Search centers, location...
              </Text>
            </View>
            {/* Mode filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeChips}>
              {MODES.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMode(m);
                  }}
                  style={[
                    styles.modeChip,
                    {
                      backgroundColor: mode === m ? colors.primary : colors.card,
                      borderColor: mode === m ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.modeChipText, { color: mode === m ? "#fff" : colors.mutedForeground }]}>{m}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => {
          const modeStyle = MODE_COLORS[item.mode] ?? { bg: colors.muted, text: colors.foreground };
          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Image */}
              <View style={styles.cardImageWrap}>
                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                <View style={[styles.modeBadge, { backgroundColor: modeStyle.bg }]}>
                  <Text style={[styles.modeBadgeText, { color: modeStyle.text }]}>{item.mode}</Text>
                </View>
                {item.isVerified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: "#10B981" }]}>
                    <Ionicons name="checkmark-circle" size={11} color="#fff" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.cardBody}>
                <Text style={[styles.centerName, { color: colors.foreground }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.locationText, { color: colors.mutedForeground }]}>{item.location}</Text>
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={[styles.ratingText, { color: colors.foreground }]}>{item.rating}</Text>
                    <Text style={[styles.ratingCount, { color: colors.mutedForeground }]}>({item.reviews})</Text>
                  </View>
                </View>

                {/* Info grid */}
                <View style={styles.infoGrid}>
                  {[
                    { icon: "school-outline", value: item.classes },
                    { icon: "ribbon-outline", value: item.boards },
                    { icon: "people-outline", value: `${item.teachers} Teachers` },
                    { icon: "cash-outline", value: item.fee },
                  ].map((info) => (
                    <View key={info.icon} style={[styles.infoItem, { backgroundColor: colors.muted }]}>
                      <Ionicons name={info.icon as any} size={12} color={colors.primary} />
                      <Text style={[styles.infoText, { color: colors.foreground }]} numberOfLines={1}>{info.value}</Text>
                    </View>
                  ))}
                </View>

                {/* Tags */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsList}>
                  {item.tags.map((tag) => (
                    <View key={tag} style={[styles.tagPill, { backgroundColor: item.color + "15", borderColor: item.color + "30" }]}>
                      <Text style={[styles.tagPillText, { color: item.color }]}>{tag}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Actions */}
                <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                  <Pressable
                    style={[styles.callBtn, { borderColor: colors.border }]}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Ionicons name="call-outline" size={15} color={colors.mutedForeground} />
                    <Text style={[styles.callBtnText, { color: colors.mutedForeground }]}>Call</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.enquireBtn, { backgroundColor: item.color }]}
                    onPress={() => handleEnquire(item.name)}
                  >
                    <Text style={styles.enquireBtnText}>Enquire Now</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
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

  statsStrip: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 14,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 10 },
  statValue: { fontSize: 16, fontWeight: "800" as const },
  statLabel: { fontSize: 11, marginTop: 1 },

  list: { paddingHorizontal: 20, paddingTop: 4, gap: 14 },
  listHeader: { paddingTop: 14, gap: 12, marginBottom: 4 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchPlaceholder: { fontSize: 14 },
  modeChips: { gap: 8 },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeChipText: { fontSize: 13, fontWeight: "600" as const },

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
  cardImageWrap: { position: "relative" },
  cardImage: { width: "100%", height: 180 },
  modeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modeBadgeText: { fontSize: 11, fontWeight: "700" as const },
  verifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: { color: "#fff", fontSize: 10, fontWeight: "700" as const },

  cardBody: { padding: 14, gap: 10 },
  centerName: { fontSize: 17, fontWeight: "800" as const, letterSpacing: -0.4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 12, flex: 1 },
  ratingPill: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontWeight: "700" as const },
  ratingCount: { fontSize: 11 },

  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: "48%",
  },
  infoText: { fontSize: 11, fontWeight: "600" as const, flex: 1 },

  tagsList: { gap: 6 },
  tagPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagPillText: { fontSize: 11, fontWeight: "600" as const },

  cardActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
  },
  callBtnText: { fontSize: 13, fontWeight: "600" as const },
  enquireBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 11,
  },
  enquireBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" as const },
});
