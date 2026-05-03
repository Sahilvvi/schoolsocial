import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventCard } from "@/components/EventCard";
import { SchoolCard } from "@/components/SchoolCard";
import { TutorCard } from "@/components/TutorCard";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES, EVENTS, JOBS, SCHOOLS, STATS, TUTORS } from "@/lib/data";

const { width } = Dimensions.get("window");

const FEATURED_SCHOOLS = SCHOOLS.filter((s) => s.isFeatured);
const PREVIEW_EVENTS = EVENTS.slice(0, 2);
const PREVIEW_JOBS = JOBS.slice(0, 2);

const NEWS_ITEMS = [
  {
    id: "1",
    title: "CBSE Announces New Assessment Pattern for 2026-27",
    category: "CBSE",
    readTime: "3 min",
    date: "May 1",
    color: "#2563EB",
    icon: "newspaper-outline" as const,
  },
  {
    id: "2",
    title: "How to Choose the Right School for Your Child",
    category: "Guide",
    readTime: "5 min",
    date: "Apr 28",
    color: "#7C3AED",
    icon: "school-outline" as const,
  },
  {
    id: "3",
    title: "Top Scholarships for Indian Students in 2026",
    category: "Career",
    readTime: "6 min",
    date: "Apr 15",
    color: "#EF4444",
    icon: "trophy-outline" as const,
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const handleCategoryPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === "schools" || id === "compare") router.push("/(tabs)/schools" as any);
    else if (id === "tutors") router.push("/(tabs)/tutors" as any);
    else if (id === "events") router.push("/(tabs)/events" as any);
    else if (id === "jobs") router.push("/jobs" as any);
    else if (id === "news") router.push("/news" as any);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── TOP BAR ── */}
      <View style={[styles.topBar, { paddingTop: topPad + 14, backgroundColor: colors.background }]}>
        <View>
          <Text style={[styles.logoText, { color: colors.foreground }]}>
            My<Text style={{ color: colors.primary }}>School</Text>
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={11} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.mutedForeground }]}>Loni, Ghaziabad · NCR</Text>
          </View>
        </View>
        <View style={styles.topBarActions}>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/community" as any)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={19} color={colors.foreground} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/news" as any)}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.foreground} />
            <View style={[styles.notifDot, { backgroundColor: "#EF4444" }]} />
          </Pressable>
          <Pressable
            style={[
              styles.avatarBtn,
              { backgroundColor: user ? colors.primary : colors.muted },
            ]}
            onPress={() => router.push("/(tabs)/profile" as any)}
          >
            {user ? (
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            ) : (
              <Ionicons name="person-outline" size={17} color={colors.mutedForeground} />
            )}
          </Pressable>
        </View>
      </View>

      {/* ── GREETING + HEADLINE ── */}
      <View style={[styles.greetSection, { backgroundColor: colors.background }]}>
        <Text style={[styles.greetSmall, { color: colors.mutedForeground }]}>
          {user ? `${greeting()}, ${user.name.split(" ")[0]} 👋` : `${greeting()} 👋`}
        </Text>
        <Text style={[styles.greetBig, { color: colors.foreground }]}>
          Find your child's{"\n"}perfect school
        </Text>
      </View>

      {/* ── SEARCH BAR ── */}
      <Pressable
        style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push("/(tabs)/schools" as any)}
      >
        <View style={[styles.searchIconBox, { backgroundColor: colors.primary }]}>
          <Ionicons name="search" size={16} color="#fff" />
        </View>
        <Text style={[styles.searchPlaceholder, { color: colors.mutedForeground }]}>
          Search schools, tutors, events...
        </Text>
        <View style={[styles.filterPill, { backgroundColor: colors.accent }]}>
          <Ionicons name="options-outline" size={14} color={colors.primary} />
        </View>
      </Pressable>

      {/* ── STATS STRIP ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsStrip}
      >
        {[
          { value: `${STATS.schools}+`, label: "Schools", color: colors.primary },
          { value: `${STATS.tuitions}+`, label: "Tutors", color: colors.secondary },
          { value: `${Math.round(STATS.parents / 1000)}K+`, label: "Parents", color: "#10B981" },
          { value: `${STATS.rating}★`, label: "Avg Rating", color: "#F59E0B" },
        ].map((s) => (
          <View key={s.label} style={[styles.statChip, { backgroundColor: s.color + "12", borderColor: s.color + "28" }]}>
            <Text style={[styles.statChipValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statChipLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ── CATEGORIES ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explore</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.categoryPill,
                {
                  backgroundColor: cat.color + "14",
                  borderColor: cat.color + "30",
                  opacity: pressed ? 0.75 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
              onPress={() => handleCategoryPress(cat.id)}
            >
              <View style={[styles.catIconBox, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon as any} size={15} color="#fff" />
              </View>
              <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── FEATURED SCHOOLS ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: colors.primary }]}>TOP PICKS</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Schools</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/schools" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
          </Pressable>
        </View>
        <FlatList
          data={FEATURED_SCHOOLS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <SchoolCard school={item} horizontal />}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      </View>

      {/* ── GRADIENT BANNER ── */}
      <View style={styles.bannerOuter}>
        <View style={styles.bannerCard}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerEmoji}>🎯</Text>
            <Text style={styles.bannerTitle}>Find Your Child's{"\n"}Perfect School</Text>
            <Text style={styles.bannerSub}>AI-powered matching in 2 minutes</Text>
            <Pressable
              style={styles.bannerBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/(tabs)/schools" as any);
              }}
            >
              <Text style={styles.bannerBtnText}>Get Matched</Text>
              <Ionicons name="arrow-forward" size={13} color="#2563EB" />
            </Pressable>
          </View>
          <View style={styles.bannerRight}>
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatVal}>4.8★</Text>
              <Text style={styles.bannerStatLbl}>Rating</Text>
            </View>
            <View style={[styles.bannerStat, { marginTop: 10 }]}>
              <Text style={styles.bannerStatVal}>500+</Text>
              <Text style={styles.bannerStatLbl}>Schools</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── TOP TUTORS ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: colors.secondary }]}>VERIFIED EXPERTS</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Tutors</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/tutors" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
          </Pressable>
        </View>
        <FlatList
          data={TUTORS.slice(0, 4)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TutorCard tutor={item} compact />}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      </View>

      {/* ── COMMUNITY ── */}
      <Pressable
        style={[styles.communityBanner, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push("/community" as any)}
      >
        <View style={[styles.communityIcon, { backgroundColor: "#7C3AED15" }]}>
          <Ionicons name="people" size={24} color="#7C3AED" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.communityTitle, { color: colors.foreground }]}>Join the Community</Text>
          <Text style={[styles.communitySub, { color: colors.mutedForeground }]}>
            Chat with 12K+ parents, teachers & educators
          </Text>
        </View>
        <View style={[styles.communityArrow, { backgroundColor: "#7C3AED" }]}>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </View>
      </Pressable>

      {/* ── LATEST NEWS ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: "#EF4444" }]}>EDUCATION NEWS</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Latest Blogs</Text>
          </View>
          <Pressable onPress={() => router.push("/news" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
          </Pressable>
        </View>
        {NEWS_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.newsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/news" as any)}
          >
            <View style={[styles.newsAccent, { backgroundColor: item.color }]} />
            <View style={{ flex: 1, padding: 12, gap: 4 }}>
              <View style={styles.newsMeta}>
                <View style={[styles.newsCatPill, { backgroundColor: item.color + "18" }]}>
                  <Ionicons name={item.icon} size={10} color={item.color} />
                  <Text style={[styles.newsCat, { color: item.color }]}>{item.category}</Text>
                </View>
                <Text style={[styles.newsDate, { color: colors.mutedForeground }]}>{item.date} · {item.readTime} read</Text>
              </View>
              <Text style={[styles.newsTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} style={{ alignSelf: "center", marginRight: 12 }} />
          </Pressable>
        ))}
      </View>

      {/* ── UPCOMING EVENTS ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: "#F59E0B" }]}>UPCOMING</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>School Events</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/events" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
          </Pressable>
        </View>
        {PREVIEW_EVENTS.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </View>

      {/* ── TEACHING JOBS ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: "#10B981" }]}>NOW HIRING</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Teaching Jobs</Text>
          </View>
          <Pressable onPress={() => router.push("/jobs" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
          </Pressable>
        </View>
        {PREVIEW_JOBS.map((job) => (
          <Pressable
            key={job.id}
            style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/jobs" as any)}
          >
            <View style={[styles.jobIconBox, { backgroundColor: "#10B98115" }]}>
              <Ionicons name="briefcase-outline" size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={1}>{job.title}</Text>
              <Text style={[styles.jobSchool, { color: colors.mutedForeground }]}>
                {job.school} · {job.location}
              </Text>
              <Text style={[styles.jobSalary, { color: "#10B981" }]}>{job.salary}</Text>
            </View>
            <View style={[styles.jobNewBadge, { backgroundColor: job.postedDays <= 2 ? "#EF444415" : colors.muted }]}>
              <Text style={[styles.jobNewText, { color: job.postedDays <= 2 ? "#EF4444" : colors.mutedForeground }]}>
                {job.postedDays <= 2 ? "NEW" : `${job.postedDays}d`}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* ── OWNER CTA ── */}
      <View style={[styles.ownerCta, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.ownerCtaIconBox, { backgroundColor: colors.accent }]}>
          <Ionicons name="school" size={28} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.ownerCtaTitle, { color: colors.foreground }]}>Own a School or Tuition?</Text>
          <Text style={[styles.ownerCtaSub, { color: colors.mutedForeground }]}>
            Get discovered by thousands of parents. Free listing.
          </Text>
        </View>
        <Pressable
          style={[styles.ownerCtaBtn, { backgroundColor: colors.primary }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Text style={styles.ownerCtaBtnText}>List Free</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900" as const,
    letterSpacing: -0.8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  locationText: { fontSize: 12 },
  topBarActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 15, fontWeight: "800" as const },

  // Greeting
  greetSection: { paddingHorizontal: 20, paddingBottom: 16 },
  greetSmall: { fontSize: 13, fontWeight: "500" as const, marginBottom: 4 },
  greetBig: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.8, lineHeight: 33 },

  // Search
  searchBar: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchPlaceholder: { flex: 1, fontSize: 14 },
  filterPill: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats
  statsStrip: { gap: 10, paddingHorizontal: 20, paddingTop: 16 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statChipValue: { fontSize: 14, fontWeight: "800" as const },
  statChipLabel: { fontSize: 12 },

  // Sections
  section: { paddingHorizontal: 20, paddingTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionTag: { fontSize: 10, fontWeight: "700" as const, letterSpacing: 1.2, marginBottom: 2 },
  sectionTitle: { fontSize: 20, fontWeight: "800" as const, letterSpacing: -0.5 },
  seeAll: { fontSize: 14, fontWeight: "600" as const },

  // Categories
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    width: (width - 50) / 3,
  },
  catIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  catLabel: { fontSize: 13, fontWeight: "700" as const },

  // Banner
  bannerOuter: { marginHorizontal: 20, marginTop: 28 },
  bannerCard: {
    borderRadius: 22,
    padding: 22,
    flexDirection: "row",
    backgroundColor: "#1E3A8A",
    overflow: "hidden",
    gap: 12,
  },
  bannerLeft: { flex: 1, gap: 6 },
  bannerEmoji: { fontSize: 28 },
  bannerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.5, lineHeight: 24 },
  bannerSub: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  bannerBtnText: { color: "#2563EB", fontSize: 13, fontWeight: "700" as const },
  bannerRight: { justifyContent: "center", alignItems: "center", gap: 6 },
  bannerStat: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 70,
  },
  bannerStatVal: { color: "#fff", fontSize: 16, fontWeight: "800" as const },
  bannerStatLbl: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 },

  // Community banner
  communityBanner: {
    marginHorizontal: 20,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  communityTitle: { fontSize: 15, fontWeight: "700" as const },
  communitySub: { fontSize: 12, marginTop: 2 },
  communityArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  // News cards
  newsCard: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  newsAccent: { width: 4 },
  newsMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  newsCatPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsCat: { fontSize: 10, fontWeight: "700" as const },
  newsDate: { fontSize: 11 },
  newsTitle: { fontSize: 13, fontWeight: "600" as const, lineHeight: 19 },

  // Job cards
  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  jobIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  jobTitle: { fontSize: 14, fontWeight: "700" as const },
  jobSchool: { fontSize: 12, marginTop: 1 },
  jobSalary: { fontSize: 12, fontWeight: "700" as const, marginTop: 3 },
  jobNewBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  jobNewText: { fontSize: 10, fontWeight: "700" as const },

  // Owner CTA
  ownerCta: {
    marginHorizontal: 20,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ownerCtaIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ownerCtaTitle: { fontSize: 15, fontWeight: "700" as const },
  ownerCtaSub: { fontSize: 12, marginTop: 3, lineHeight: 17 },
  ownerCtaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  ownerCtaBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" as const },
});
