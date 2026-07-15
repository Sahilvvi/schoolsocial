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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const ARTICLES = [
  {
    id: "1",
    category: "CBSE",
    categoryColor: "#2563EB",
    title: "CBSE Announces New Assessment Pattern for 2026-27 Academic Year",
    summary: "The Central Board of Secondary Education has introduced competency-based questions in all major subjects from Class 9 onwards.",
    author: "Meena Rajput",
    authorRole: "Education Correspondent",
    date: "May 1, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    body: [
      { type: "para", text: "The Central Board of Secondary Education (CBSE) has announced a significant overhaul of its assessment pattern for the 2026-27 academic year. The new system introduces competency-based questions across all major subjects for students in Class 9 and above." },
      { type: "heading", text: "Key Changes" },
      { type: "para", text: "Under the revised pattern, 40% of questions in board examinations will now be competency-based, testing students' ability to apply knowledge rather than simply recall facts. This is a shift from the traditional rote-learning approach that has dominated Indian education for decades." },
      { type: "quote", text: "We aim to create learners who can think critically and solve real-world problems, not just score marks in exams." },
      { type: "para", text: "The new assessment framework aligns with the National Education Policy (NEP) 2020, which emphasises holistic, conceptual understanding over memorisation. Schools across India are expected to adapt their teaching methods accordingly." },
      { type: "heading", text: "Impact on Students" },
      { type: "para", text: "Students will need to develop stronger analytical and reasoning skills. CBSE recommends regular practice of case-study-based questions, data interpretation, and application problems. Coaching centres and private tutors are already updating their curricula to match the new pattern." },
      { type: "para", text: "Parents are advised to encourage reading comprehension, logical thinking activities, and conceptual problem-solving at home. The change will be introduced in phases, starting with Class 9 & 10 this year." },
    ],
    tags: ["CBSE", "Board Exams", "Assessment Reform", "Education Policy"],
    likes: 247,
  },
  {
    id: "2",
    category: "Guide",
    categoryColor: "#7C3AED",
    title: "How to Choose the Right School for Your Child: A Complete Guide",
    summary: "From board selection to fee structure and extracurricular activities — here's everything you need to consider before enrolling.",
    author: "Priya Nair",
    authorRole: "Parenting Expert",
    date: "Apr 28, 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    body: [
      { type: "para", text: "Choosing the right school for your child is one of the most important decisions you'll make as a parent. It's not just about academic rankings — it's about finding the right environment where your child can thrive." },
      { type: "heading", text: "1. Start with the Board" },
      { type: "para", text: "India offers multiple education boards: CBSE, ICSE, State Board, IB, and IGCSE. CBSE is the most widely accepted and prepares students well for competitive exams like JEE and NEET. ICSE is known for strong English language skills. IB/IGCSE are globally recognised and ideal if you plan to send your child abroad." },
      { type: "heading", text: "2. Consider Location and Commute" },
      { type: "para", text: "A long daily commute is stressful for young children and can affect their energy levels and enthusiasm for school. Ideally, choose a school within 20-30 minutes of home. Also check if the school offers bus services." },
      { type: "heading", text: "3. Check Fees vs. Value" },
      { type: "para", text: "Annual fees alone don't tell the whole story. Ask about development fees, activity fees, transport charges, and uniform costs. Compare the total yearly expenditure with the facilities offered — sports grounds, labs, libraries, and technology infrastructure." },
      { type: "quote", text: "The best school is not the most expensive one — it's the one where your child feels safe, valued, and inspired to learn." },
      { type: "heading", text: "4. Visit the School in Person" },
      { type: "para", text: "Never choose a school based solely on its website or brochure. Visit during school hours to observe the classroom environment, teacher-student interaction, cleanliness, and the overall atmosphere. Talk to existing parents if possible." },
    ],
    tags: ["School Selection", "Parenting", "Education Guide", "CBSE vs ICSE"],
    likes: 583,
  },
  {
    id: "3",
    category: "Admissions",
    categoryColor: "#F59E0B",
    title: "Admission Season 2026: Key Dates and What to Expect",
    summary: "School admissions for 2026-27 are now open. Here are the important deadlines and documents you will need to prepare.",
    author: "Rahul Sharma",
    authorRole: "Education Reporter",
    date: "Apr 25, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    body: [
      { type: "para", text: "The admission season for the 2026-27 academic year is officially underway, with most schools in the NCR region opening their application windows. Here is everything you need to know to stay ahead." },
      { type: "heading", text: "Important Dates" },
      { type: "para", text: "Most CBSE schools in Uttar Pradesh and Delhi NCR begin accepting applications in April-May for the following academic year. Nursery admissions typically close by end of May, while Class 1-8 lateral entry admissions may remain open through July." },
      { type: "heading", text: "Documents Required" },
      { type: "para", text: "Keep the following documents ready: Birth certificate (original + photocopy), Aadhaar card of child and parents, Previous year mark sheet or report card, Proof of residence (electricity bill / rental agreement), 4-6 passport size photographs of the child." },
      { type: "quote", text: "Apply to at least 3-5 schools simultaneously. Don't put all your hopes in just one school." },
      { type: "heading", text: "Tips for a Successful Application" },
      { type: "para", text: "Apply early — many popular schools fill up quickly and waitlists close fast. Attend open houses and interaction sessions when invited. Be honest about your child's interests, learning style, and any special needs during the interview. A good school will value authenticity over a scripted performance." },
    ],
    tags: ["Admissions 2026", "School Admission", "Documents", "NCR Schools"],
    likes: 412,
  },
  {
    id: "4",
    category: "Parenting",
    categoryColor: "#10B981",
    title: "Benefits of Co-Curricular Activities in Student Development",
    summary: "Research shows students involved in sports, arts, and clubs perform 20% better academically on average.",
    author: "Dr. Sunita Mehta",
    authorRole: "Child Psychologist",
    date: "Apr 20, 2026",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    body: [
      { type: "para", text: "Multiple studies from leading educational institutions confirm that students who actively participate in co-curricular activities — sports, arts, music, drama, and clubs — consistently outperform their peers who focus solely on academics." },
      { type: "heading", text: "Why Co-Curricular Activities Matter" },
      { type: "para", text: "Co-curricular participation develops time management, teamwork, leadership, and resilience — skills that no textbook can fully teach. These students also report lower stress levels and higher self-esteem." },
      { type: "quote", text: "Children learn as much from the football field and the art room as they do from the classroom." },
      { type: "heading", text: "Finding the Right Balance" },
      { type: "para", text: "The key is balance. Overloading a child with activities can be counterproductive. Work with your child to identify 1-2 activities they genuinely enjoy and commit to those, rather than enrolling in many just for the sake of a resume." },
      { type: "para", text: "When evaluating schools, look at the variety and quality of their co-curricular programmes. Schools that invest in good sports facilities, trained music teachers, and active student clubs signal that they value holistic development." },
    ],
    tags: ["Co-curricular", "Child Development", "Sports", "Parenting Tips"],
    likes: 329,
  },
  {
    id: "5",
    category: "Career",
    categoryColor: "#EF4444",
    title: "Top Scholarships for Indian Students in 2026",
    summary: "A comprehensive list of merit-based and need-based scholarships available for school and college students across India.",
    author: "Anjali Gupta",
    authorRole: "Career Counsellor",
    date: "Apr 15, 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=800&q=80",
    body: [
      { type: "para", text: "Scholarships can significantly reduce the financial burden of education and open doors to opportunities that might otherwise be out of reach. Here is a curated list of the most accessible and valuable scholarships for Indian students in 2026." },
      { type: "heading", text: "Central Government Scholarships" },
      { type: "para", text: "The National Means-cum-Merit Scholarship (NMMSS) supports students from Class 9-12 from economically weaker sections. The Central Sector Scheme of Scholarships (CSSS) covers students who have scored above 80% in their board exams and are in the top 20 percentile." },
      { type: "heading", text: "State Scholarships" },
      { type: "para", text: "Every state has its own scholarship programmes. In Uttar Pradesh, the UP Scholarship Scheme covers students from SC/ST/OBC/General (EWS) categories from Class 1 to postgraduate level. Applications typically open between July and October." },
      { type: "quote", text: "A scholarship is not a charity. It's a recognition of merit and an investment in the future." },
      { type: "heading", text: "Private and Corporate Scholarships" },
      { type: "para", text: "Companies like Tata, Reliance, L'Oréal, Infosys, and HDFC offer prestigious scholarships. The Tata Scholarship Fund and the Reliance Foundation Scholarship are among the most sought-after. These often require essays, recommendation letters, and interviews." },
    ],
    tags: ["Scholarships", "Financial Aid", "Higher Education", "Career"],
    likes: 891,
  },
  {
    id: "6",
    category: "Guide",
    categoryColor: "#F97316",
    title: "Understanding CBSE vs ICSE: Which Board is Right for Your Child?",
    summary: "Both boards have their strengths. We break down the curriculum, difficulty, and career impact to help you decide.",
    author: "Prof. Amit Verma",
    authorRole: "Education Consultant",
    date: "Apr 10, 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    body: [
      { type: "para", text: "The CBSE vs ICSE debate is one of the most common dilemmas for parents in India. Both are excellent boards with distinct philosophies, strengths, and suitable student profiles." },
      { type: "heading", text: "CBSE: Strengths" },
      { type: "para", text: "CBSE is the most widely followed board in India with over 25,000 affiliated schools. Its syllabus is closely aligned with competitive entrance exams like JEE (engineering) and NEET (medical). CBSE is ideal for students who aspire to engineering, medicine, or government jobs in India." },
      { type: "heading", text: "ICSE: Strengths" },
      { type: "para", text: "ICSE has a more comprehensive and detailed syllabus, particularly strong in English language and literature. Students from ICSE schools often develop better reading, writing, and analytical skills. It is ideal for students inclined towards humanities, arts, or international education." },
      { type: "quote", text: "Neither board is universally better. The right choice depends on your child's learning style, strengths, and long-term goals." },
      { type: "heading", text: "Making the Decision" },
      { type: "para", text: "Consider your child's learning style. If they prefer structured, concise content and plan to take competitive entrance exams, CBSE is likely the better fit. If they enjoy reading widely, writing in depth, and may study abroad, ICSE or IB would serve them better." },
    ],
    tags: ["CBSE", "ICSE", "Board Comparison", "Education Guide"],
    likes: 1204,
  },
];

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="newspaper-outline" size={48} color={colors.mutedForeground} />
        <Text style={[{ fontSize: 18, fontWeight: "800" as const, color: colors.foreground }]}>Article not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" as const }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Share Article", "Link copied to clipboard!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 80 }}>
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: article.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          {/* Back + actions */}
          <View style={[styles.heroTop, { top: topPad + 10 }]}>
            <Pressable style={styles.floatBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </Pressable>
            <View style={styles.heroTopRight}>
              <Pressable
                style={styles.floatBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBookmarked(!bookmarked);
                }}
              >
                <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={18} color="#fff" />
              </Pressable>
              <Pressable style={styles.floatBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Hero badge */}
          <View style={styles.heroBadge}>
            <View style={[styles.catPill, { backgroundColor: article.categoryColor }]}>
              <Text style={styles.catText}>{article.category}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Read time + date */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{article.readTime} read</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{article.date}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.foreground }]}>{article.title}</Text>

          {/* Author */}
          <View style={[styles.authorRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <View style={[styles.authorAvatar, { backgroundColor: article.categoryColor }]}>
              <Text style={styles.authorInitial}>{article.author.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[styles.authorName, { color: colors.foreground }]}>{article.author}</Text>
              <Text style={[styles.authorRole, { color: colors.mutedForeground }]}>{article.authorRole}</Text>
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {article.body.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <Text key={i} style={[styles.heading, { color: colors.foreground }]}>{block.text}</Text>
                );
              }
              if (block.type === "quote") {
                return (
                  <View key={i} style={[styles.quoteBlock, { backgroundColor: article.categoryColor + "12", borderLeftColor: article.categoryColor }]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color={article.categoryColor} style={{ marginBottom: 4 }} />
                    <Text style={[styles.quoteText, { color: colors.foreground }]}>{block.text}</Text>
                  </View>
                );
              }
              return (
                <Text key={i} style={[styles.para, { color: colors.mutedForeground }]}>{block.text}</Text>
              );
            })}
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            <Text style={[styles.tagsLabel, { color: colors.mutedForeground }]}>TAGS</Text>
            <View style={styles.tags}>
              {article.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <Text style={[styles.tagText, { color: colors.foreground }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 10 }]}>
        <Pressable
          style={[styles.likeBtn, { backgroundColor: liked ? "#FEF2F2" : colors.muted }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setLiked(!liked);
          }}
        >
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#EF4444" : colors.mutedForeground} />
          <Text style={[styles.likeBtnText, { color: liked ? "#EF4444" : colors.mutedForeground }]}>
            {liked ? article.likes + 1 : article.likes}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.bookmarkBtn, { borderColor: colors.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setBookmarked(!bookmarked);
          }}
        >
          <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={18} color={bookmarked ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.bookmarkBtnText, { color: bookmarked ? colors.primary : colors.mutedForeground }]}>
            {bookmarked ? "Saved" : "Save"}
          </Text>
        </Pressable>
        <Pressable style={[styles.shareBtn, { backgroundColor: colors.primary }]} onPress={handleShare}>
          <Ionicons name="share-outline" size={16} color="#fff" />
          <Text style={styles.shareBtnText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },

  heroContainer: { position: "relative" },
  heroImage: { width: "100%", height: 260 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroTop: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTopRight: { flexDirection: "row", gap: 8 },
  floatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  catText: { color: "#fff", fontSize: 12, fontWeight: "700" as const },

  content: { padding: 20, gap: 0 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#9CA3AF" },

  title: { fontSize: 24, fontWeight: "800" as const, lineHeight: 32, letterSpacing: -0.5, marginBottom: 16 },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  authorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  authorInitial: { color: "#fff", fontSize: 18, fontWeight: "700" as const },
  authorName: { fontSize: 14, fontWeight: "700" as const },
  authorRole: { fontSize: 12, marginTop: 1 },

  body: { gap: 14 },
  heading: { fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.3, marginTop: 6 },
  para: { fontSize: 15, lineHeight: 24 },
  quoteBlock: {
    borderLeftWidth: 3,
    padding: 14,
    borderRadius: 12,
    gap: 4,
  },
  quoteText: { fontSize: 15, fontStyle: "italic" as const, lineHeight: 23, fontWeight: "500" as const },

  tagsSection: { marginTop: 24, gap: 10 },
  tagsLabel: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 1 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontWeight: "600" as const },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderTopWidth: 1,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  likeBtnText: { fontSize: 14, fontWeight: "700" as const },
  bookmarkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  bookmarkBtnText: { fontSize: 14, fontWeight: "600" as const },
  shareBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  shareBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" as const },
});
