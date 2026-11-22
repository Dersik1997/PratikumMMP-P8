import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import DiaryCard from "../../src/components/DiaryCard";
import {
  setMoodFilter,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const MOODS = ["all", "😊", "😌", "🔥", "😢", "😴"];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const entries = useAppSelector((state) => state.diary.entries);
  const moodFilter = useAppSelector((state) => state.diary.moodFilter);

  // Selector spesifik untuk statistik (Tugas Praktikum AD.4 & Modul X.3)
  const totalDiary = useAppSelector((state) => state.diary.entries.length);
  const totalFavorite = useAppSelector(
    (state) => state.diary.entries.filter((item) => item.liked).length,
  );

  const filteredEntries = entries.filter((entry) => {
    if (moodFilter === "all") return true;
    return entry.mood === moodFilter;
  });

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        {/* Header Buku Harian (sesuai Modul S.1) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buku Harian</Text>
          <Text style={styles.counter}>{entries.length} diary</Text>
        </View>

        {/* Statistik Total Diary & Total Favorite (Tugas Praktikum AD.4) */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statEmoji}>📖</Text>
            <View>
              <Text style={styles.statNumber}>{totalDiary}</Text>
              <Text style={styles.statLabel}>Total Diary</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.statCardFavorite]}>
            <Text style={styles.statEmoji}>❤️</Text>
            <View>
              <Text style={styles.statNumber}>{totalFavorite}</Text>
              <Text style={styles.statLabel}>Total Favorite</Text>
            </View>
          </View>
        </View>

        {/* Filter Mood (Tugas Praktikum AD.3) */}
        <View style={styles.moodFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodFilterList}
          >
            {MOODS.map((mood) => {
              const isSelected = moodFilter === mood;
              return (
                <Pressable
                  key={mood}
                  onPress={() => dispatch(setMoodFilter(mood))}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {mood === "all" ? "Semua" : mood}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* List Diary */}
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DiaryCard
              title={item.title}
              date={item.date}
              preview={item.preview}
              mood={item.mood}
              liked={item.liked}
              onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
              onPress={() =>
                router.push({
                  pathname: "/detail/[id]",
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTitle}>Belum Ada Diary</Text>
              <Text style={styles.emptyDesc}>
                {moodFilter !== "all"
                  ? `Tidak ada diary dengan mood ${moodFilter}. Coba pilih filter mood lain.`
                  : "Tekan tab Tambah di bawah untuk membuat catatan diary pertamamu!"}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    paddingHorizontal: SPACE.l,
    paddingTop: SPACE.xl,
  },
  header: {
    marginBottom: SPACE.m,
  },
  headerTitle: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
  },
  counter: {
    color: COLORS.muted,
    fontSize: TYPO.body,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    gap: SPACE.m,
    marginBottom: SPACE.m,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.m,
    padding: SPACE.m,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  statCardFavorite: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  statEmoji: {
    fontSize: 26,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginTop: 1,
  },
  moodFilterContainer: {
    marginBottom: SPACE.m,
  },
  moodFilterList: {
    flexDirection: "row",
    gap: SPACE.s,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterChipActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACE.xl,
    marginTop: 30,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: TYPO.title,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: TYPO.body,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
