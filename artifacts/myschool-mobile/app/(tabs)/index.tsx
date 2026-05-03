import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
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
import { EVENTS, SCHOOLS, STATS, TUTORS } from "@/lib/data";

const { width } = Dimensions.get("window");

const FEATURED_SCHOOLS = SCHOOLS.filter((s) => s.isFeatured);
const FEATURED_EVENTS = EVENTS.filter((e) => e.isFeatured);

const CATEGORIES = [
  { id: "schools", label: "Schools", icon: "school-outline" as const, tab: "schools" },
  { id: "tutors", label: "Tutors", icon: "person-outline" as const, tab: "tutors" },
  { id: "events", label: "Events", icon: "calendar-outline" as const, tab: "events" },
  { id: "profile", label: "Profile", icon: "person-circle-outline" as const, tab: "profile" },
];

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.statIconBox, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function CategoryButton({
  item,
  onPress,
}: {
  item: (typeof CATEGORIES)[0];
  onPress: () => void;
}) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 40 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View
          style={[
            styles.categoryBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.categoryIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name={item.icon} size={22} color={colors.primary} />
          </View>
          <Text style={[styles.categoryLabel, { color: colors.foreground }]}>
            {item.label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/schools?search=${encodeURIComponent(search)}`);
    }
  };

  const handleCategoryPress = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(tabs)/${tab === "schools" ? "" : tab}` as any);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header */}
      <View
        style={[
          styles.hero,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.primary,
          },
        ]}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.heroGreeting}>
              {user ? `Hello, ${user.name.split(" ")[0]}` : "Welcome back"}
            </Text>
            <Text style={styles.heroTagline}>Find the perfect school</Text>
          </View>
          <Pressable
            style={styles.avatarBtn}
            onPress={() => router.push("/(tabs)/profile")}
          >
            {user ? (
              <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            ) : (
              <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Ionicons name="person" size={22} color="#fff" />
              </View>
            )}
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable
          style={styles.searchBox}
          onPress={() => router.push("/schools" as any)}
        >
          <View style={styles.searchInner}>
            <Ionicons name="search-outline" size={18} color="#64748B" />
            <Text style={styles.searchPlaceholder}>Search schools, tutors, events...</Text>
          </View>
          <View style={styles.filterPill}>
            <Ionicons name="options-outline" size={15} color={colors.primary} />
          </View>
        </Pressable>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.locationText}>Loni, Ghaziabad · NCR</Text>
          <Ionicons name="chevron-down" size={13} color="rgba(255,255,255,0.7)" />
        </View>
      </View>

      {/* Stats Strip */}
      <View style={[styles.statsStrip, { backgroundColor: colors.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScrollContent}>
          <StatCard icon="school-outline" value={`${STATS.schools}+`} label="Schools" color={colors.primary} />
          <StatCard icon="people-outline" value={`${STATS.tuitions}+`} label="Tuitions" color={colors.secondary} />
          <StatCard icon="happy-outline" value={`${Math.round(STATS.parents / 1000)}K+`} label="Parents" color="#10B981" />
          <StatCard icon="star-outline" value={`${STATS.rating}★`} label="Avg Rating" color="#F59E0B" />
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryButton
              key={cat.id}
              item={cat}
              onPress={() => handleCategoryPress(cat.tab)}
            />
          ))}
        </View>
      </View>

      {/* Featured Schools */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: colors.primary }]}>TOP PICKS</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Schools</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/schools" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        <FlatList
          data={FEATURED_SCHOOLS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <SchoolCard school={item} horizontal />}
          contentContainerStyle={{ paddingRight: 20 }}
          scrollEnabled={FEATURED_SCHOOLS.length > 1}
        />
      </View>

      {/* Featured Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: "#F59E0B" }]}>UPCOMING</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>School Events</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/events" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        {FEATURED_EVENTS.slice(0, 1).map((e) => (
          <EventCard key={e.id} event={e} featured />
        ))}
      </View>

      {/* Top Tutors */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTag, { color: colors.secondary }]}>VERIFIED</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Tutors</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/tutors" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        <FlatList
          data={TUTORS.slice(0, 4)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TutorCard tutor={item} compact />}
          contentContainerStyle={{ paddingRight: 20 }}
          scrollEnabled
        />
      </View>

      {/* CTA Banner */}
      <View style={[styles.ctaBanner, { backgroundColor: colors.primary }]}>
        <View style={styles.ctaLeft}>
          <Text style={styles.ctaTitle}>Find Your Child's Perfect School</Text>
          <Text style={styles.ctaSubtitle}>Take our 2-min quiz and get matched</Text>
        </View>
        <Pressable
          style={styles.ctaBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/schools" as any);
          }}
        >
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500" as const,
  },
  heroTagline: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  avatarBtn: {
    padding: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  searchInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchPlaceholder: {
    color: "#94A3B8",
    fontSize: 14,
  },
  filterPill: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500" as const,
  },

  // Stats
  statsStrip: {
    paddingTop: 16,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    width: 90,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600" as const,
  },

  // Categories
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  categoryBtn: {
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    width: (width - 60) / 4,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    textAlign: "center",
  },

  // CTA
  ctaBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaLeft: {
    flex: 1,
  },
  ctaTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  ctaSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  ctaBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
