import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SCHOOLS } from "@/lib/data";

type AdmissionStatus = "Applied" | "Under Review" | "Visit Scheduled" | "Decision Pending" | "Accepted" | "Rejected";

interface Admission {
  id: string;
  schoolId: string;
  grade: string;
  appliedDate: string;
  status: AdmissionStatus;
  nextStep?: string;
  nextDate?: string;
}

const ADMISSIONS: Admission[] = [
  {
    id: "a1",
    schoolId: "1",
    grade: "Class 6",
    appliedDate: "Apr 20, 2026",
    status: "Visit Scheduled",
    nextStep: "Campus visit",
    nextDate: "May 15, 2026",
  },
  {
    id: "a2",
    schoolId: "3",
    grade: "Class 7",
    appliedDate: "Apr 25, 2026",
    status: "Under Review",
    nextStep: "Documents verification",
  },
  {
    id: "a3",
    schoolId: "6",
    grade: "Class 8",
    appliedDate: "May 1, 2026",
    status: "Applied",
    nextStep: "Waiting for school response",
  },
];

const STATUS_CONFIG: Record<AdmissionStatus, { color: string; bg: string; icon: string }> = {
  Applied: { color: "#2563EB", bg: "#EFF6FF", icon: "paper-plane-outline" },
  "Under Review": { color: "#F59E0B", bg: "#FFFBEB", icon: "time-outline" },
  "Visit Scheduled": { color: "#7C3AED", bg: "#F5F3FF", icon: "calendar-outline" },
  "Decision Pending": { color: "#F97316", bg: "#FFF7ED", icon: "hourglass-outline" },
  Accepted: { color: "#10B981", bg: "#ECFDF5", icon: "checkmark-circle-outline" },
  Rejected: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle-outline" },
};

const STEPS: AdmissionStatus[] = ["Applied", "Under Review", "Visit Scheduled", "Decision Pending", "Accepted"];

const FILTER_TABS = ["All", "Active", "Accepted", "Rejected"];

export default function AdmissionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState("All");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = ADMISSIONS.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Active") return !["Accepted", "Rejected"].includes(a.status);
    return a.status === filter;
  });

  const getStepIndex = (status: AdmissionStatus) => STEPS.indexOf(status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>My Admissions</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {ADMISSIONS.length} applications tracked
          </Text>
        </View>
        <Pressable
          style={[styles.applyNewBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/schools" as any)}
        >
          <Ionicons name="add" size={15} color="#fff" />
          <Text style={styles.applyNewText}>Apply</Text>
        </Pressable>
      </View>

      {/* Summary stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.muted }]}>
        {[
          { label: "Total", value: ADMISSIONS.length.toString(), color: "#2563EB" },
          { label: "Active", value: ADMISSIONS.filter((a) => !["Accepted", "Rejected"].includes(a.status)).length.toString(), color: "#F59E0B" },
          { label: "Accepted", value: ADMISSIONS.filter((a) => a.status === "Accepted").length.toString(), color: "#10B981" },
          { label: "Rejected", value: ADMISSIONS.filter((a) => a.status === "Rejected").length.toString(), color: "#EF4444" },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        {FILTER_TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setFilter(tab)}
            style={[
              styles.filterTab,
              {
                borderBottomColor: filter === tab ? colors.primary : "transparent",
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text style={[styles.filterTabText, { color: filter === tab ? colors.primary : colors.mutedForeground }]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(a) => a.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No applications</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Apply to schools to track your admissions here
            </Text>
            <Pressable
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/schools" as any)}
            >
              <Text style={styles.browseBtnText}>Browse Schools</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const school = SCHOOLS.find((s) => s.id === item.schoolId);
          const cfg = STATUS_CONFIG[item.status];
          const stepIdx = getStepIndex(item.status);

          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.schoolName, { color: colors.foreground }]} numberOfLines={2}>
                    {school?.name ?? "School"}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Ionicons name="school-outline" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>{item.grade}</Text>
                    <Text style={[styles.dotSep, { color: colors.mutedForeground }]}>·</Text>
                    <Ionicons name="calendar-outline" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>Applied {item.appliedDate}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon as any} size={12} color={cfg.color} />
                  <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
                </View>
              </View>

              {/* Progress bar */}
              {!["Accepted", "Rejected"].includes(item.status) && (
                <View style={styles.progressSection}>
                  <View style={styles.stepsRow}>
                    {STEPS.map((step, i) => {
                      const done = i <= stepIdx;
                      const current = i === stepIdx;
                      return (
                        <React.Fragment key={step}>
                          <View style={[
                            styles.stepDot,
                            {
                              backgroundColor: done ? colors.primary : colors.muted,
                              borderColor: current ? colors.primary : "transparent",
                              borderWidth: current ? 2 : 0,
                            },
                          ]}>
                            {done && !current && <Ionicons name="checkmark" size={8} color="#fff" />}
                          </View>
                          {i < STEPS.length - 1 && (
                            <View style={[styles.stepLine, { backgroundColor: i < stepIdx ? colors.primary : colors.border }]} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>
                  <Text style={[styles.currentStep, { color: colors.mutedForeground }]}>
                    Step {stepIdx + 1} of {STEPS.length}: {item.status}
                  </Text>
                </View>
              )}

              {item.status === "Accepted" && (
                <View style={[styles.acceptedBanner, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={[styles.acceptedText, { color: "#10B981" }]}>
                    Congratulations! You've been accepted.
                  </Text>
                </View>
              )}

              {/* Next step */}
              {item.nextStep && !["Accepted", "Rejected"].includes(item.status) && (
                <View style={[styles.nextStepBox, { backgroundColor: colors.accent, borderColor: colors.primary + "25" }]}>
                  <Ionicons name="arrow-forward-circle-outline" size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nextStepLabel, { color: colors.primary }]}>Next Step</Text>
                    <Text style={[styles.nextStepText, { color: colors.foreground }]}>{item.nextStep}</Text>
                    {item.nextDate && (
                      <Text style={[styles.nextDate, { color: colors.mutedForeground }]}>📅 {item.nextDate}</Text>
                    )}
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                <Pressable
                  style={[styles.actionBtn, { borderColor: colors.border }]}
                  onPress={() => router.push(`/school/${item.schoolId}` as any)}
                >
                  <Ionicons name="eye-outline" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>View School</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { borderColor: colors.border }]}>
                  <Ionicons name="chatbubble-outline" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>Contact</Text>
                </Pressable>
                {item.status === "Visit Scheduled" && (
                  <Pressable style={[styles.scheduleBtn, { backgroundColor: "#7C3AED" }]}>
                    <Ionicons name="calendar" size={13} color="#fff" />
                    <Text style={styles.scheduleBtnText}>View Visit</Text>
                  </Pressable>
                )}
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
  applyNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 4,
  },
  applyNewText: { color: "#fff", fontSize: 13, fontWeight: "700" as const },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  statValue: { fontSize: 22, fontWeight: "800" as const },
  statLabel: { fontSize: 12, marginTop: 2 },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 16,
    borderBottomWidth: 1,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 4,
  },
  filterTabText: { fontSize: 14, fontWeight: "600" as const },

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
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
  },
  schoolName: { fontSize: 16, fontWeight: "800" as const, letterSpacing: -0.4 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  cardMetaText: { fontSize: 12 },
  dotSep: { fontSize: 12, marginHorizontal: 1 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: { fontSize: 11, fontWeight: "700" as const },

  progressSection: { paddingHorizontal: 16, paddingBottom: 14, gap: 8 },
  stepsRow: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLine: { flex: 1, height: 2 },
  currentStep: { fontSize: 12 },

  acceptedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
  },
  acceptedText: { fontSize: 14, fontWeight: "700" as const, flex: 1 },

  nextStepBox: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  nextStepLabel: { fontSize: 10, fontWeight: "700" as const, letterSpacing: 0.8, marginBottom: 2 },
  nextStepText: { fontSize: 13, fontWeight: "600" as const },
  nextDate: { fontSize: 12, marginTop: 3 },

  cardActions: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  actionBtnText: { fontSize: 12, fontWeight: "600" as const },
  scheduleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 7,
    borderRadius: 9,
  },
  scheduleBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" as const },

  empty: { alignItems: "center", paddingTop: 80, gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: "800" as const },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  browseBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, marginTop: 4 },
  browseBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
});
