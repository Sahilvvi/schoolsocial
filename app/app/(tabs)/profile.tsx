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
  iconColor,
  iconBg,
}: {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
  iconColor?: string;
  iconBg?: string;
}) {
  const colors = useColors();
  const resolvedIconColor = iconColor ?? (danger ? "#EF4444" : colors.primary);
  const resolvedIconBg = iconBg ?? (danger ? "#FEF2F2" : colors.accent);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: resolvedIconBg }]}>
        <Ionicons name={icon as any} size={19} color={resolvedIconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: danger ? "#EF4444" : colors.foreground }]}>{label}</Text>
        {subtitle && <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{subtitle}</Text>}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function MenuSection({ title, children }: { title?: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.menuSection}>
      {title && (
        <Text style={[styles.menuGroupLabel, { color: colors.mutedForeground }]}>{title}</Text>
      )}
      {children}
    </View>
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

  const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
    parent: { label: "Parent Account", color: "#2563EB", bg: "#EFF6FF" },
    school: { label: "School Admin", color: "#7C3AED", bg: "#F5F3FF" },
    teacher: { label: "Teacher", color: "#10B981", bg: "#ECFDF5" },
    admin: { label: "Platform Admin", color: "#EF4444", bg: "#FEF2F2" },
  };

  const rc = roleConfig[user!.role] ?? { label: user!.role, color: colors.primary, bg: colors.accent };

  const parentItems = [
    { icon: "grid-outline", label: "My Dashboard", subtitle: "Overview of your activity", onPress: () => router.push("/dashboard" as any), iconColor: "#2563EB", iconBg: "#EFF6FF" },
    { icon: "book-outline", label: "My Admissions", subtitle: "Track application status", onPress: () => router.push("/admissions" as any), badge: "2", iconColor: "#7C3AED", iconBg: "#F5F3FF" },
    { icon: "calendar-outline", label: "Booked Sessions", subtitle: "Upcoming tutor sessions", onPress: () => router.push("/(tabs)/tutors" as any), badge: "1", iconColor: "#7C3AED", iconBg: "#F5F3FF" },
    { icon: "heart-outline", label: "Saved Schools", subtitle: "Your shortlisted schools", onPress: () => router.push("/saved" as any), badge: "7", iconColor: "#EF4444", iconBg: "#FEF2F2" },
    { icon: "calendar-outline", label: "Registered Events", subtitle: "School events you joined", onPress: () => router.push("/(tabs)/events" as any), iconColor: "#F59E0B", iconBg: "#FFFBEB" },
  ];

  const schoolItems = [
    { icon: "grid-outline", label: "School Dashboard", subtitle: "Views, enquiries & analytics", onPress: () => router.push("/dashboard" as any), iconColor: "#2563EB", iconBg: "#EFF6FF" },
    { icon: "document-text-outline", label: "Manage Admissions", subtitle: "Review applications", onPress: () => {}, badge: "5", iconColor: "#7C3AED", iconBg: "#F5F3FF" },
    { icon: "briefcase-outline", label: "Post a Job", subtitle: "Hire teaching staff", onPress: () => router.push("/jobs" as any), iconColor: "#10B981", iconBg: "#ECFDF5" },
    { icon: "calendar-outline", label: "School Events", subtitle: "Manage upcoming events", onPress: () => router.push("/(tabs)/events" as any), iconColor: "#F59E0B", iconBg: "#FFFBEB" },
    { icon: "trophy-outline", label: "Plans & Pricing", subtitle: "Upgrade your school listing", onPress: () => router.push("/plans" as any), iconColor: "#F97316", iconBg: "#FFF7ED" },
  ];

  const teacherItems = [
    { icon: "briefcase-outline", label: "Find Teaching Jobs", subtitle: "Browse open positions", onPress: () => router.push("/jobs" as any), iconColor: "#10B981", iconBg: "#ECFDF5" },
    { icon: "people-outline", label: "My Students", subtitle: "Active tutoring sessions", onPress: () => router.push("/(tabs)/tutors" as any), iconColor: "#2563EB", iconBg: "#EFF6FF" },
    { icon: "chatbubble-outline", label: "Community", subtitle: "Connect with educators", onPress: () => router.push("/community" as any), iconColor: "#7C3AED", iconBg: "#F5F3FF" },
  ];

  const adminItems = [
    { icon: "shield-outline", label: "Admin Panel", subtitle: "Manage platform", onPress: () => {}, iconColor: "#EF4444", iconBg: "#FEF2F2" },
    { icon: "school-outline", label: "All Schools", subtitle: "Browse & verify listings", onPress: () => router.push("/(tabs)/schools" as any), iconColor: "#2563EB", iconBg: "#EFF6FF" },
    { icon: "analytics-outline", label: "Platform Analytics", subtitle: "Traffic & engagement", onPress: () => {}, iconColor: "#7C3AED", iconBg: "#F5F3FF" },
  ];

  const roleItemsMap: Record<string, typeof parentItems> = {
    parent: parentItems,
    school: schoolItems,
    teacher: teacherItems,
    admin: adminItems,
  };

  const roleItems = roleItemsMap[user!.role] ?? parentItems;
  const roleSectionLabel =
    user!.role === "parent" ? "MY ACTIVITY"
    : user!.role === "school" ? "SCHOOL PORTAL"
    : user!.role === "teacher" ? "TEACHING"
    : "ADMIN TOOLS";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <View style={[styles.profileHeader, { paddingTop: topPad + 16, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Profile</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Your account & settings</Text>
          </View>
            <View style={styles.headerActions}>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: "#7C3AED14", borderColor: "#7C3AED30" }]}
              onPress={() => router.push("/scanner" as any)}
            >
              <Ionicons name="qr-code-outline" size={18} color="#7C3AED" />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.primary + "14", borderColor: colors.primary + "30" }]}
              onPress={() => router.push("/dashboard" as any)}
            >
              <Ionicons name="grid-outline" size={18} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarRing, { borderColor: rc.color + "50" }]}>
            <View style={[styles.avatarCircle, { backgroundColor: rc.color }]}>
              <Text style={styles.avatarLetter}>{user!.name.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{user!.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>{user!.email}</Text>
            <View style={[styles.rolePill, { backgroundColor: rc.bg }]}>
              <Text style={[styles.rolePillText, { color: rc.color }]}>{rc.label}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      {user!.role === "parent" && (
        <View style={[styles.quickStats, { backgroundColor: colors.muted }]}>
          {[
            { value: "2", label: "Applications", color: "#2563EB" },
            { value: "7", label: "Saved", color: "#EF4444" },
            { value: "1", label: "Sessions", color: "#7C3AED" },
          ].map((s) => (
            <View key={s.label} style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.quickStatLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Role-specific items */}
      <MenuSection title={roleSectionLabel}>
        {roleItems.map((item) => (
          <MenuItem key={item.label} {...item} />
        ))}
      </MenuSection>

      {/* Discover section */}
      <MenuSection title="DISCOVER">
        <MenuItem
          icon="newspaper-outline"
          label="Education News"
          subtitle="Blogs, guides & updates"
          onPress={() => router.push("/news" as any)}
          iconColor="#EF4444"
          iconBg="#FEF2F2"
        />
        <MenuItem
          icon="book-outline"
          label="Tuition Centers"
          subtitle="Coaching centers near you"
          onPress={() => router.push("/tuitions" as any)}
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
        />
        <MenuItem
          icon="people-outline"
          label="Community"
          subtitle="Parents, teachers & educators"
          onPress={() => router.push("/community" as any)}
          iconColor="#2563EB"
          iconBg="#EFF6FF"
        />
        <MenuItem
          icon="briefcase-outline"
          label="Teaching Jobs"
          subtitle="School job openings"
          onPress={() => router.push("/jobs" as any)}
          iconColor="#10B981"
          iconBg="#ECFDF5"
        />
      </MenuSection>

      {/* Account */}
      <MenuSection title="ACCOUNT">
        <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
        <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => {}} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
      </MenuSection>

      {/* Sign Out */}
      <MenuSection>
        <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleSignOut} danger />
      </MenuSection>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>MySchool v1.0.0 · Made in India 🇮🇳</Text>
    </ScrollView>
  );
}

const DEMO_PANELS = [
  { key: "parent",  label: "Parent",   icon: "people-outline",    color: "#2563EB", bg: "#EFF6FF",  email: "parent@myschool.demo"  },
  { key: "school",  label: "School",   icon: "school-outline",    color: "#7C3AED", bg: "#F5F3FF",  email: "school@myschool.demo"  },
  { key: "teacher", label: "Teacher",  icon: "person-outline",    color: "#10B981", bg: "#ECFDF5",  email: "teacher@myschool.demo" },
  { key: "tuition", label: "Tuition",  icon: "book-outline",      color: "#F59E0B", bg: "#FFFBEB",  email: "tuition@myschool.demo" },
  { key: "admin",   label: "Admin",    icon: "shield-outline",    color: "#EF4444", bg: "#FEF2F2",  email: "admin@myschool.demo"   },
] as const;

const SIGNUP_ROLES = [
  { value: "parent",  label: "Parent",         icon: "people-outline",  desc: "Find schools & track admissions",     color: "#2563EB", bg: "#EFF6FF" },
  { value: "teacher", label: "Teacher",         icon: "person-outline",  desc: "Find jobs & create your profile",     color: "#10B981", bg: "#ECFDF5" },
  { value: "school",  label: "School",          icon: "school-outline",  desc: "List school & manage admissions",     color: "#7C3AED", bg: "#F5F3FF" },
  { value: "tuition", label: "Tuition Center",  icon: "book-outline",    desc: "List batches & manage students",      color: "#F59E0B", bg: "#FFFBEB" },
] as const;

function LoggedOutView() {
  const { signIn } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Signup-only state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const resetAll = () => {
    setEmail(""); setPassword(""); setError("");
    setSignupName(""); setSignupEmail(""); setSignupPassword(""); setSignupRole("");
    setForgotEmail(""); setForgotSent(false);
  };

  const switchMode = (m: "login" | "signup" | "forgot") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetAll();
    setMode(m);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    const result = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true); setError("");
    if (mode !== "login") setMode("login");
    const result = await signIn(demoEmail, "Demo@1234");
    setLoading(false);
    if (result.error) setError(result.error);
    else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSignUp = () => {
    if (!signupRole) { setError("Please choose your role"); return; }
    if (!signupName.trim()) { setError("Please enter your name"); return; }
    if (!signupEmail.trim()) { setError("Please enter your email"); return; }
    if (signupPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    Alert.alert("Account Created!", "For this demo, please sign in with a demo account below.", [{ text: "OK", onPress: () => switchMode("login") }]);
  };

  const handleForgot = () => {
    if (!forgotEmail.trim()) { setError("Please enter your email"); return; }
    setForgotSent(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        {/* ── Header ── */}
        <View style={[styles.authHeaderArea, { paddingTop: topPad + 20, backgroundColor: colors.background }]}>
          <View style={[styles.authLogoIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="school" size={22} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.foreground }]}>
            My<Text style={{ color: colors.primary }}>School</Text>
          </Text>
          <Text style={[styles.authTagline, { color: colors.mutedForeground }]}>India's #1 School Discovery Platform</Text>
        </View>

        {/* ── Role panels — quick login cards ── */}
        {mode !== "forgot" && (
          <View style={styles.panelsSection}>
            <Text style={[styles.panelsLabel, { color: colors.mutedForeground }]}>QUICK DEMO LOGIN</Text>
            <View style={styles.panelsGrid}>
              {DEMO_PANELS.map((p) => (
                <Pressable
                  key={p.key}
                  style={[styles.panelCard, { backgroundColor: p.bg, borderColor: p.color + "30" }]}
                  onPress={() => handleQuickLogin(p.email)}
                  disabled={loading}
                >
                  <View style={[styles.panelCardIcon, { backgroundColor: p.color + "20" }]}>
                    <Ionicons name={p.icon as any} size={18} color={p.color} />
                  </View>
                  <Text style={[styles.panelCardLabel, { color: p.color }]}>{p.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.panelHint, { color: colors.mutedForeground }]}>
              Tap any role above to sign in instantly · Password: Demo@1234
            </Text>
          </View>
        )}

        {/* ── Mode tabs ── */}
        {mode !== "forgot" && (
          <View style={[styles.modeTabs, { backgroundColor: colors.muted }]}>
            {(["login", "signup"] as const).map((m) => (
              <Pressable
                key={m}
                style={[
                  styles.modeTab,
                  mode === m && { backgroundColor: colors.background, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }
                ]}
                onPress={() => switchMode(m)}
              >
                <Text style={[styles.modeTabText, { color: mode === m ? colors.primary : colors.mutedForeground }]}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* ── SIGN IN ── */}
        {mode === "login" && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Welcome back</Text>
            <Text style={[styles.formSub, { color: colors.mutedForeground }]}>Sign in to access your dashboard</Text>

            {!!error && (
              <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
                <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

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
                secureTextEntry={!showPass}
              />
              <Pressable onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <Pressable onPress={() => switchMode("forgot")} style={{ alignSelf: "flex-end" as const }}>
              <Text style={[styles.forgotLink, { color: colors.primary }]}>Forgot password?</Text>
            </Pressable>

            <Pressable
              style={[styles.signInBtn, { backgroundColor: colors.primary, opacity: loading ? 0.8 : 1 }]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.signInBtnText}>{loading ? "Signing in..." : "Sign In"}</Text>
              {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
            </Pressable>
          </View>
        )}

        {/* ── SIGN UP ── */}
        {mode === "signup" && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Get started</Text>
            <Text style={[styles.formSub, { color: colors.mutedForeground }]}>Create an account in seconds</Text>

            {!!error && (
              <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
                <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Role picker */}
            <Text style={[styles.rolePickerLabel, { color: colors.mutedForeground }]}>I am a…</Text>
            <View style={styles.roleGrid}>
              {SIGNUP_ROLES.map((r) => {
                const selected = signupRole === r.value;
                return (
                  <Pressable
                    key={r.value}
                    style={[
                      styles.roleCard,
                      { borderColor: selected ? r.color : colors.border, backgroundColor: selected ? r.bg : colors.card }
                    ]}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSignupRole(r.value); setError(""); }}
                  >
                    <View style={[styles.roleCardIcon, { backgroundColor: r.color + (selected ? "20" : "10") }]}>
                      <Ionicons name={r.icon as any} size={18} color={r.color} />
                    </View>
                    <Text style={[styles.roleCardLabel, { color: selected ? r.color : colors.foreground }]}>{r.label}</Text>
                    <Text style={[styles.roleCardDesc, { color: colors.mutedForeground }]}>{r.desc}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Full name"
                placeholderTextColor={colors.mutedForeground}
                value={signupName}
                onChangeText={setSignupName}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Email address"
                placeholderTextColor={colors.mutedForeground}
                value={signupEmail}
                onChangeText={setSignupEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Create password (min 6 chars)"
                placeholderTextColor={colors.mutedForeground}
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry={!showPass}
              />
              <Pressable onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <Pressable
              style={[styles.signInBtn, { backgroundColor: colors.primary }]}
              onPress={handleSignUp}
            >
              <Text style={styles.signInBtnText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable onPress={() => switchMode("login")} style={styles.backLink}>
              <Ionicons name="arrow-back" size={16} color={colors.mutedForeground} />
              <Text style={[styles.backLinkText, { color: colors.mutedForeground }]}>Back to Sign In</Text>
            </Pressable>

            {forgotSent ? (
              <View style={styles.forgotSentWrap}>
                <View style={[styles.forgotSentIcon, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="checkmark-circle" size={36} color="#10B981" />
                </View>
                <Text style={[styles.formTitle, { color: colors.foreground, textAlign: "center" as const }]}>Reset link sent!</Text>
                <Text style={[styles.formSub, { color: colors.mutedForeground, textAlign: "center" as const }]}>
                  Check your inbox and follow the instructions to reset your password.
                </Text>
                <Pressable onPress={() => switchMode("login")}>
                  <Text style={[styles.forgotLink, { color: colors.primary, textAlign: "center" as const, marginTop: 8 }]}>
                    Back to Sign In
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={[styles.formTitle, { color: colors.foreground }]}>Forgot password?</Text>
                <Text style={[styles.formSub, { color: colors.mutedForeground }]}>
                  Enter your email and we'll send a reset link.
                </Text>

                {!!error && (
                  <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
                    <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="Your email address"
                    placeholderTextColor={colors.mutedForeground}
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Pressable
                  style={[styles.signInBtn, { backgroundColor: colors.primary }]}
                  onPress={handleForgot}
                >
                  <Text style={styles.signInBtnText}>Send Reset Link</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
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

  // Logged in — header
  profileHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.7 },
  headerSub: { fontSize: 13, marginTop: 2 },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  editBtnText: { fontSize: 13, fontWeight: "600" as const },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { color: "#fff", fontSize: 26, fontWeight: "800" as const },
  profileName: { fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.4 },
  profileEmail: { fontSize: 13, marginTop: 2, marginBottom: 8 },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  rolePillText: { fontSize: 12, fontWeight: "700" as const },

  // Quick stats
  quickStats: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  quickStatValue: { fontSize: 22, fontWeight: "800" as const },
  quickStatLabel: { fontSize: 12, marginTop: 2 },

  // Menu sections
  menuSection: { marginTop: 24, paddingHorizontal: 20, gap: 8 },
  menuGroupLabel: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
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
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "600" as const },
  menuSub: { fontSize: 12, marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" as const },
  version: { textAlign: "center", fontSize: 12, marginTop: 28, marginBottom: 8 },

  // Logged out
  authHeaderArea: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoText: { fontSize: 30, fontWeight: "900" as const, letterSpacing: -1 },
  authTagline: { fontSize: 14, marginTop: 4 },
  welcomeCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  welcomeIconRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeTitle: { fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.4 },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontSize: 14, fontWeight: "500" as const, flex: 1 },
  formCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: { fontSize: 20, fontWeight: "800" as const, letterSpacing: -0.4 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  errorText: { color: "#EF4444", fontSize: 13, flex: 1 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  signInBtn: { borderRadius: 14, paddingVertical: 15, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 },
  signInBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
  demoBox: { borderRadius: 12, borderWidth: 1, padding: 12 },
  demoTitle: { fontSize: 13, fontWeight: "700" as const, marginBottom: 4 },
  demoText: { fontSize: 12, lineHeight: 18 },

  // Auth — panels grid
  panelsSection: { marginHorizontal: 20, marginBottom: 16 },
  panelsLabel: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 1, marginBottom: 10 },
  panelsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  panelCard: {
    width: "18%",
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 10,
    alignItems: "center" as const,
    gap: 6,
  },
  panelCardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  panelCardLabel: { fontSize: 11, fontWeight: "800" as const, textAlign: "center" as const },
  panelHint: { fontSize: 11, textAlign: "center" as const, marginTop: 8, lineHeight: 16 },

  // Auth — mode tabs
  modeTabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modeTabText: { fontSize: 14, fontWeight: "700" as const },

  // Auth — form extras
  formSub: { fontSize: 13, marginBottom: 4 },
  forgotLink: { fontSize: 13, fontWeight: "600" as const, marginBottom: 4 },
  backLink: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backLinkText: { fontSize: 13, fontWeight: "500" as const },

  // Auth — logo icon
  authLogoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  // Auth — sign-up role picker
  rolePickerLabel: { fontSize: 12, fontWeight: "700" as const, letterSpacing: 0.5, marginBottom: 8 },
  roleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  roleCard: {
    width: "47.5%",
    borderRadius: 14,
    borderWidth: 2,
    padding: 12,
    gap: 6,
  },
  roleCardIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  roleCardLabel: { fontSize: 13, fontWeight: "800" as const },
  roleCardDesc: { fontSize: 11, lineHeight: 15 },

  // Auth — forgot sent
  forgotSentWrap: { alignItems: "center" as const, gap: 10, paddingVertical: 8 },
  forgotSentIcon: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", marginBottom: 4 },
});
