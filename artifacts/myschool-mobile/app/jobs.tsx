import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { JOBS } from "@/lib/data";

const ALL_JOBS = [
  ...JOBS,
  {
    id: "4",
    title: "Primary Teacher (Classes 1-5)",
    school: "Bal Bharati Public School",
    location: "Pitampura, Delhi",
    salary: "₹25,000–₹35,000/mo",
    type: "Full-time",
    subject: "General",
    experience: "1+ years",
    postedDays: 3,
  },
  {
    id: "5",
    title: "TGT Science Teacher",
    school: "Kendriya Vidyalaya No. 1",
    location: "Ghaziabad",
    salary: "₹35,000–₹50,000/mo",
    type: "Full-time",
    subject: "Science",
    experience: "2+ years",
    postedDays: 7,
  },
  {
    id: "6",
    title: "Physical Education Teacher",
    school: "Ryan International School",
    location: "Noida",
    salary: "₹28,000–₹40,000/mo",
    type: "Full-time",
    subject: "PE",
    experience: "2+ years",
    postedDays: 4,
  },
];

const SUBJECTS = ["All", "Mathematics", "English", "Science", "General", "Administration", "PE"];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#2563EB",
  English: "#7C3AED",
  Science: "#10B981",
  General: "#F59E0B",
  Administration: "#EF4444",
  PE: "#F97316",
  Chemistry: "#0EA5E9",
};

export default function JobsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [subject, setSubject] = useState("All");
  const [applied, setApplied] = useState<string[]>([]);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = subject === "All" ? ALL_JOBS : ALL_JOBS.filter((j) => j.subject === subject);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Teaching Jobs</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{ALL_JOBS.length} openings near you</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(j) => j.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Stats strip */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsStrip}>
              {[
                { label: "Active Jobs", value: `${ALL_JOBS.length}`, color: "#2563EB", icon: "briefcase-outline" },
                { label: "Schools Hiring", value: "12+", color: "#7C3AED", icon: "school-outline" },
                { label: "Avg Salary", value: "₹40K/mo", color: "#10B981", icon: "cash-outline" },
                { label: "Full-time", value: "100%", color: "#F59E0B", icon: "time-outline" },
              ].map((s) => (
                <View key={s.label} style={[styles.statChip, { backgroundColor: s.color + "12", borderColor: s.color + "25" }]}>
                  <Ionicons name={s.icon as any} size={14} color={s.color} />
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Subject filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipScroll}>
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
                  <Text style={[styles.chipText, { color: subject === s ? "#fff" : colors.mutedForeground }]}>{s}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => {
          const subjectColor = SUBJECT_COLORS[item.subject] ?? colors.primary;
          const isApplied = applied.includes(item.id);
          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.jobIconBox, { backgroundColor: subjectColor + "15" }]}>
                  <Ionicons name="briefcase-outline" size={22} color={subjectColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jobTitle, { color: colors.foreground }]}>{item.title}</Text>
                  <Text style={[styles.schoolName, { color: colors.mutedForeground }]}>{item.school}</Text>
                </View>
                <View style={[styles.newBadge, { backgroundColor: item.postedDays <= 2 ? "#EF444415" : colors.muted }]}>
                  <Text style={[styles.newBadgeText, { color: item.postedDays <= 2 ? "#EF4444" : colors.mutedForeground }]}>
                    {item.postedDays <= 2 ? "NEW" : `${item.postedDays}d ago`}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.type}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="school-outline" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.experience}</Text>
                </View>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <Text style={[styles.salary, { color: "#10B981" }]}>{item.salary}</Text>
                <Pressable
                  style={[
                    styles.applyBtn,
                    { backgroundColor: isApplied ? colors.muted : colors.primary },
                  ]}
                  onPress={() => setApplied((prev) => isApplied ? prev.filter((x) => x !== item.id) : [...prev, item.id])}
                >
                  <Text style={[styles.applyBtnText, { color: isApplied ? colors.mutedForeground : "#fff" }]}>
                    {isApplied ? "Applied ✓" : "Apply Now"}
                  </Text>
                </Pressable>
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
  list: { paddingBottom: 100 },
  statsStrip: { gap: 10, paddingHorizontal: 20, paddingTop: 16 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: { fontSize: 14, fontWeight: "800" as const },
  statLabel: { fontSize: 11 },
  chipScroll: { marginTop: 14, marginBottom: 4 },
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: "600" as const },
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  jobIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  jobTitle: { fontSize: 15, fontWeight: "700" as const, lineHeight: 20 },
  schoolName: { fontSize: 12, marginTop: 2 },
  newBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  newBadgeText: { fontSize: 11, fontWeight: "700" as const },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  salary: { fontSize: 15, fontWeight: "800" as const },
  applyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
  },
  applyBtnText: { fontSize: 13, fontWeight: "700" as const },
});
