import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { SCHOOLS } from "@/lib/data";

const MAX_COMPARE = 3;

const COMPARE_ROWS = [
  { key: "board", label: "Board", icon: "ribbon-outline" },
  { key: "type", label: "Type", icon: "business-outline" },
  { key: "rating", label: "Rating", icon: "star" },
  { key: "fees", label: "Annual Fees", icon: "cash-outline" },
  { key: "students", label: "Students", icon: "people-outline" },
  { key: "established", label: "Established", icon: "calendar-outline" },
  { key: "grades", label: "Grades", icon: "school-outline" },
  { key: "principal", label: "Principal", icon: "person-outline" },
];

function getValue(school: (typeof SCHOOLS)[0], key: string): string {
  switch (key) {
    case "board": return school.board;
    case "type": return school.type;
    case "rating": return `${school.rating} ★ (${school.reviewCount})`;
    case "fees": return school.fees;
    case "students": return school.students.toLocaleString();
    case "established": return school.established.toString();
    case "grades": return school.grades;
    case "principal": return school.principal;
    default: return "—";
  }
}

export default function CompareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"select" | "compare">("select");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = useMemo(() =>
    SCHOOLS.filter((s) =>
      !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const selectedSchools = useMemo(() =>
    selectedIds.map((id) => SCHOOLS.find((s) => s.id === id)).filter(Boolean) as typeof SCHOOLS,
    [selectedIds]
  );

  const allFacilities = useMemo(() => {
    const set = new Set<string>();
    selectedSchools.forEach((s) => s.facilities.forEach((f) => set.add(f)));
    return [...set].sort();
  }, [selectedSchools]);

  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else if (selectedIds.length < MAX_COMPARE) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  if (step === "compare") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setStep("select")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Comparison</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              {selectedSchools.length} schools compared
            </Text>
          </View>
          <Pressable
            style={[styles.editBtn, { borderColor: colors.border }]}
            onPress={() => setStep("select")}
          >
            <Ionicons name="create-outline" size={15} color={colors.mutedForeground} />
            <Text style={[styles.editBtnText, { color: colors.mutedForeground }]}>Edit</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 60 }}>
          {/* School name headers */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* School name columns */}
              <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
                <View style={styles.rowLabel} />
                {selectedSchools.map((s) => (
                  <View key={s.id} style={[styles.colHeader, { borderLeftColor: colors.border }]}>
                    <View style={[styles.colBadge, { backgroundColor: colors.accent }]}>
                      <Text style={[styles.colBoard, { color: colors.primary }]}>{s.board}</Text>
                    </View>
                    <Text style={[styles.colName, { color: colors.foreground }]} numberOfLines={2}>{s.name}</Text>
                    <Text style={[styles.colCity, { color: colors.mutedForeground }]}>{s.city}</Text>
                  </View>
                ))}
              </View>

              {/* Comparison rows */}
              {COMPARE_ROWS.map((row, ri) => (
                <View
                  key={row.key}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: ri % 2 === 0 ? colors.background : colors.muted + "60",
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.rowLabel}>
                    <Ionicons name={row.icon as any} size={13} color={colors.mutedForeground} />
                    <Text style={[styles.rowLabelText, { color: colors.mutedForeground }]}>{row.label}</Text>
                  </View>
                  {selectedSchools.map((s) => (
                    <View key={s.id} style={[styles.cell, { borderLeftColor: colors.border }]}>
                      <Text style={[styles.cellText, { color: colors.foreground }]} numberOfLines={2}>
                        {getValue(s, row.key)}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}

              {/* Facilities */}
              <View style={[styles.sectionDivider, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                <Text style={[styles.sectionDividerText, { color: colors.primary }]}>Facilities</Text>
              </View>
              {allFacilities.map((facility, ri) => (
                <View
                  key={facility}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: ri % 2 === 0 ? colors.background : colors.muted + "60",
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.rowLabel}>
                    <Text style={[styles.rowLabelText, { color: colors.mutedForeground }]} numberOfLines={2}>
                      {facility}
                    </Text>
                  </View>
                  {selectedSchools.map((s) => {
                    const has = s.facilities.includes(facility);
                    return (
                      <View key={s.id} style={[styles.cell, { borderLeftColor: colors.border, alignItems: "center" }]}>
                        <Ionicons
                          name={has ? "checkmark-circle" : "close-circle-outline"}
                          size={20}
                          color={has ? "#10B981" : colors.border}
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Apply buttons */}
          <View style={[styles.applySection, { borderTopColor: colors.border }]}>
            <Text style={[styles.applySectionTitle, { color: colors.foreground }]}>Apply to a School</Text>
            {selectedSchools.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.applyRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/school/${s.id}` as any)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.applySchoolName, { color: colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.applyFees, { color: colors.mutedForeground }]}>{s.fees} / year</Text>
                </View>
                <View style={[styles.applyBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.applyBtnText}>Apply →</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Compare Schools</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Select up to {MAX_COMPARE} schools
          </Text>
        </View>
      </View>

      {/* Selected schools bar */}
      {selectedIds.length > 0 && (
        <View style={[styles.selectedBar, { backgroundColor: colors.accent, borderBottomColor: colors.primary + "25" }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedChips}>
            {selectedSchools.map((s) => (
              <View key={s.id} style={[styles.selectedChip, { backgroundColor: colors.primary }]}>
                <Text style={styles.selectedChipText} numberOfLines={1}>{s.name.split(" ").slice(0, 2).join(" ")}</Text>
                <Pressable onPress={() => toggleSelect(s.id)}>
                  <Ionicons name="close-circle" size={15} color="rgba(255,255,255,0.85)" />
                </Pressable>
              </View>
            ))}
            {selectedIds.length < MAX_COMPARE && (
              <View style={[styles.addChip, { borderColor: colors.primary }]}>
                <Ionicons name="add" size={14} color={colors.primary} />
                <Text style={[styles.addChipText, { color: colors.primary }]}>Add school</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Search */}
      <View style={[styles.searchRow, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.mutedForeground} />
          <Text
            style={[styles.searchPlaceholder, { color: selectedIds.length === 0 ? colors.mutedForeground : colors.foreground }]}
            onPress={() => {}}
          >
            {search || "Search by name or city..."}
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          const isDisabled = !isSelected && selectedIds.length >= MAX_COMPARE;
          return (
            <Pressable
              style={[
                styles.schoolRow,
                {
                  backgroundColor: isSelected ? colors.primary + "08" : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  opacity: isDisabled ? 0.45 : 1,
                },
              ]}
              onPress={() => !isDisabled && toggleSelect(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.background,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.schoolRowTop}>
                  <View style={[styles.boardBadge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.boardText, { color: colors.primary }]}>{item.board}</Text>
                  </View>
                  {item.isVerified && (
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  )}
                </View>
                <Text style={[styles.schoolName, { color: colors.foreground }]}>{item.name}</Text>
                <View style={styles.schoolMeta}>
                  <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.schoolCity, { color: colors.mutedForeground }]}>{item.location}</Text>
                  <Text style={[styles.schoolFee, { color: colors.primary }]}>{item.fees}</Text>
                </View>
              </View>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: colors.foreground }]}>{item.rating}</Text>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Compare button */}
      {selectedIds.length >= 2 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 12 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bottomBarTitle, { color: colors.foreground }]}>
              {selectedIds.length} schools selected
            </Text>
            <Text style={[styles.bottomBarSub, { color: colors.mutedForeground }]}>
              Ready to compare
            </Text>
          </View>
          <Pressable
            style={[styles.compareBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setStep("compare");
            }}
          >
            <Ionicons name="git-compare-outline" size={18} color="#fff" />
            <Text style={styles.compareBtnText}>Compare Now</Text>
          </Pressable>
        </View>
      )}
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
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  editBtnText: { fontSize: 12, fontWeight: "600" as const },

  selectedBar: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  selectedChips: { gap: 8, paddingHorizontal: 20 },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: 140,
  },
  selectedChipText: { color: "#fff", fontSize: 12, fontWeight: "700" as const, flex: 1 },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed" as const,
  },
  addChipText: { fontSize: 12, fontWeight: "600" as const },

  searchRow: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchPlaceholder: { fontSize: 14, flex: 1 },

  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120, gap: 10 },
  schoolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  schoolRowTop: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  boardBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  boardText: { fontSize: 10, fontWeight: "700" as const },
  schoolName: { fontSize: 15, fontWeight: "700" as const, letterSpacing: -0.3 },
  schoolMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  schoolCity: { fontSize: 12, flex: 1 },
  schoolFee: { fontSize: 12, fontWeight: "700" as const },
  ratingPill: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 13, fontWeight: "700" as const },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomBarTitle: { fontSize: 15, fontWeight: "700" as const },
  bottomBarSub: { fontSize: 12, marginTop: 1 },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 16,
  },
  compareBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },

  // Comparison table
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  rowLabel: {
    width: 120,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rowLabelText: { fontSize: 12, fontWeight: "600" as const, flex: 1 },
  colHeader: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 4,
    borderLeftWidth: 1,
  },
  colBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: "flex-start" },
  colBoard: { fontSize: 10, fontWeight: "700" as const },
  colName: { fontSize: 13, fontWeight: "800" as const, lineHeight: 18 },
  colCity: { fontSize: 11 },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    minHeight: 46,
  },
  cell: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 1,
    justifyContent: "center",
  },
  cellText: { fontSize: 13, fontWeight: "500" as const },

  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionDividerText: { fontSize: 12, fontWeight: "700" as const, letterSpacing: 0.8 },

  applySection: { padding: 20, gap: 12, borderTopWidth: 1, marginTop: 8 },
  applySectionTitle: { fontSize: 18, fontWeight: "800" as const, marginBottom: 4 },
  applyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  applySchoolName: { fontSize: 14, fontWeight: "700" as const },
  applyFees: { fontSize: 12, marginTop: 2 },
  applyBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12 },
  applyBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" as const },
});
