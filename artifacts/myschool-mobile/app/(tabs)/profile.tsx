import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function MenuItem({
  icon,
  label,
  subtitle,
  onPress,
  danger,
  badge,
}: {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? "#FEF2F2" : colors.accent }]}>
        <Ionicons name={icon as any} size={20} color={danger ? "#EF4444" : colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: danger ? "#EF4444" : colors.foreground }]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{subtitle}</Text>
        )}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function LoggedInView() {
  const { user, signOut } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await signOut();
        },
      },
    ]);
  };

  const roleLabel: Record<string, string> = {
    parent: "Parent Account",
    school: "School Admin",
    teacher: "Teacher",
    admin: "Platform Admin",
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View
        style={[
          styles.profileHero,
          { paddingTop: topPad + 16, backgroundColor: colors.primary },
        ]}
      >
        <View style={[styles.profileAvatar, { backgroundColor: colors.secondary }]}>
          <Text style={styles.profileAvatarText}>
            {user!.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{user!.name}</Text>
        <Text style={styles.profileEmail}>{user!.email}</Text>
        <View style={[styles.rolePill]}>
          <Text style={styles.rolePillText}>{roleLabel[user!.role] ?? user!.role}</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={[styles.menuGroupLabel, { color: colors.mutedForeground }]}>MY ACTIVITY</Text>
        <MenuItem icon="school-outline" label="My Schools" subtitle="Saved & applied schools" onPress={() => {}} badge="3" />
        <MenuItem icon="book-outline" label="Admissions" subtitle="Track application status" onPress={() => {}} />
        <MenuItem icon="calendar-outline" label="Bookings" subtitle="Tutor sessions & events" onPress={() => {}} />
        <MenuItem icon="heart-outline" label="Saved" subtitle="Favourite schools & tutors" onPress={() => {}} badge="7" />
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.menuGroupLabel, { color: colors.mutedForeground }]}>ACCOUNT</Text>
        <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
        <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => {}} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
      </View>

      <View style={styles.menuSection}>
        <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleSignOut} danger />
      </View>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>MySchool v1.0.0</Text>
    </ScrollView>
  );
}

function LoggedOutView() {
  const { signIn } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 60, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={[styles.authHero, { paddingTop: topPad + 20, backgroundColor: colors.primary }]}>
          <View style={[styles.authIconBox]}>
            <Ionicons name="school" size={36} color={colors.primary} />
          </View>
          <Text style={styles.authTitle}>Welcome to MySchool</Text>
          <Text style={styles.authSubtitle}>India's #1 School Discovery Platform</Text>
        </View>

        <View style={styles.authBody}>
          {/* Features list */}
          {[
            { icon: "school-outline", text: "Discover 500+ verified schools" },
            { icon: "person-outline", text: "Book expert tutors instantly" },
            { icon: "calendar-outline", text: "Register for school events" },
            { icon: "checkmark-circle-outline", text: "Track admission applications" },
          ].map((f, i) => (
            <View key={i} style={styles.feature}>
              <Ionicons name={f.icon as any} size={20} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.foreground }]}>{f.text}</Text>
            </View>
          ))}

          {/* Login Form */}
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Sign In</Text>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
                <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Email address"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.signInBtn,
                { backgroundColor: colors.primary, opacity: pressed || loading ? 0.85 : 1 },
              ]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.signInBtnText}>{loading ? "Signing in..." : "Sign In"}</Text>
            </Pressable>

            <View style={[styles.demoBox, { backgroundColor: colors.accent, borderColor: colors.primary + "30" }]}>
              <Text style={[styles.demoTitle, { color: colors.primary }]}>Demo Credentials</Text>
              <Text style={[styles.demoText, { color: colors.mutedForeground }]}>
                parent@myschool.demo{"\n"}Password: Demo@1234
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function ProfileScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  return user ? <LoggedInView /> : <LoggedOutView />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Logged in
  profileHero: {
    alignItems: "center",
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  profileAvatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800" as const,
  },
  profileName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  profileEmail: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    marginTop: 2,
    marginBottom: 10,
  },
  rolePill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  rolePillText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600" as const,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 8,
  },
  menuGroupLabel: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: { flex: 1 },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  menuSub: {
    fontSize: 12,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700" as const,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },

  // Auth
  authHero: {
    alignItems: "center",
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  authIconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  authTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  authSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  authBody: {
    padding: 20,
    gap: 12,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginTop: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    flex: 1,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  signInBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  signInBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  demoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
