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

const FILTER_CATEGORIES = ["All", "CBSE", "Admissions", "Guide", "Parenting", "Career"];

const NEWS = [
  {
    id: "1",
    category: "CBSE",
    title: "CBSE Announces New Assessment Pattern for 2026-27 Academic Year",
    summary: "The Central Board of Secondary Education has introduced competency-based questions in all major subjects from Class 9 onwards.",
    readTime: "3 min",
    date: "May 1, 2026",
    color: "#2563EB",
    icon: "newspaper-outline" as const,
  },
  {
    id: "2",
    category: "Guide",
    title: "How to Choose the Right School for Your Child: A Complete Guide",
    summary: "From board selection to fee structure and extracurricular activities — here's everything you need to consider before enrolling.",
    readTime: "5 min",
    date: "Apr 28, 2026",
    color: "#7C3AED",
    icon: "school-outline" as const,
  },
  {
    id: "3",
    category: "Admissions",
    title: "Admission Season 2026: Key Dates and What to Expect",
    summary: "School admissions for 2026-27 are now open. Here are the important deadlines and documents you will need to prepare.",
    readTime: "4 min",
    date: "Apr 25, 2026",
    color: "#F59E0B",
    icon: "calendar-outline" as const,
  },
  {
    id: "4",
    category: "Parenting",
    title: "Benefits of Co-Curricular Activities in Student Development",
    summary: "Research shows students involved in sports, arts, and clubs perform 20% better academically on average.",
    readTime: "3 min",
    date: "Apr 20, 2026",
    color: "#10B981",
    icon: "heart-outline" as const,
  },
  {
    id: "5",
    category: "Career",
    title: "Top Scholarships Available for Indian Students in 2026",
    summary: "A comprehensive list of central and state government scholarships for students from all economic backgrounds.",
    readTime: "6 min",
    date: "Apr 15, 2026",
    color: "#EF4444",
    icon: "trophy-outline" as const,
  },
  {
    id: "6",
    category: "CBSE",
    title: "Board Exam Tips: How to Prepare Effectively in the Last 30 Days",
    summary: "Expert advice from top educators on revision strategies, time management and stress reduction for board exams.",
    readTime: "4 min",
    date: "Apr 10, 2026",
    color: "#F97316",
    icon: "book-outline" as const,
  },
  {
    id: "7",
    category: "Guide",
    title: "Private vs Government Schools: Which is Better for Your Child?",
    summary: "An unbiased comparison of the academic quality, infrastructure, fees, and long-term outcomes of both types.",
    readTime: "5 min",
    date: "Apr 5, 2026",
    color: "#0EA5E9",
    icon: "git-compare-outline" as const,
  },
];

export default function NewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = category === "All" ? NEWS : NEWS.filter((n) => n.category === category);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Education News</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Blogs, guides & updates</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(n) => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <FlatList
            data={FILTER_CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c}
            contentContainerStyle={styles.chips}
            style={styles.chipScroll}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setCategory(item)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: category === item ? colors.primary : colors.card,
                    borderColor: category === item ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: category === item ? "#fff" : colors.mutedForeground }]}>{item}</Text>
              </Pressable>
            )}
          />
        }
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardMeta}>
                <View style={[styles.catPill, { backgroundColor: item.color + "18" }]}>
                  <Ionicons name={item.icon} size={11} color={item.color} />
                  <Text style={[styles.catText, { color: item.color }]}>{item.category}</Text>
                </View>
                <Text style={[styles.date, { color: colors.mutedForeground }]}>{item.date}</Text>
              </View>
              <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
              <Text style={[styles.summary, { color: colors.mutedForeground }]} numberOfLines={2}>{item.summary}</Text>
              <View style={styles.cardFooter}>
                <Ionicons name="book-outline" size={12} color={colors.mutedForeground} />
                <Text style={[styles.readTime, { color: colors.mutedForeground }]}>{item.readTime} read</Text>
              </View>
            </View>
          </Pressable>
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
  list: { paddingBottom: 100 },
  chipScroll: { marginTop: 16, marginBottom: 4 },
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: "600" as const },
  card: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 14, gap: 6 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  catText: { fontSize: 11, fontWeight: "700" as const },
  date: { fontSize: 11 },
  title: { fontSize: 14, fontWeight: "700" as const, lineHeight: 20 },
  summary: { fontSize: 12, lineHeight: 18 },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  readTime: { fontSize: 11 },
});
