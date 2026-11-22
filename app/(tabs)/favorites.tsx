import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import DiaryCard from "../../src/components/DiaryCard";
import {
  clearAllFavorites,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { COLORS, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Derived state: favorite entries (Modul U.1)
  const favoriteEntries = useAppSelector((state) =>
    state.diary.entries.filter((entry) => entry.liked),
  );

  // Reducer clearAllFavorites (Tugas Praktikum AD.5)
  const handleClearAll = () => {
    Alert.alert(
      "Hapus Semua Favorite",
      "Semua status favorite akan di-reset. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Reset Semua",
          style: "destructive",
          onPress: () => dispatch(clearAllFavorites()),
        },
      ],
    );
  };

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.header}>Favorite</Text>
            <Text style={styles.counter}>
              {favoriteEntries.length} diary favorite
            </Text>
          </View>

          {favoriteEntries.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Hapus Semua</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={favoriteEntries}
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
              <Text style={styles.emptyEmoji}>❤️</Text>
              <Text style={styles.emptyTitle}>Belum Ada Diary Favorite</Text>
              <Text style={styles.emptyDesc}>
                Tekan ikon hati pada daftar diary di halaman Home untuk
                menandainya sebagai favorite.
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACE.m,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
  },
  counter: {
    color: COLORS.muted,
    fontSize: TYPO.body,
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.card,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: TYPO.caption,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACE.xl,
    marginTop: 40,
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
