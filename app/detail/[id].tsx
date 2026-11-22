import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import {
  deleteDiary,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { COLORS, RADIUS, SPACE } from "../../src/styles/tokens";

export default function DetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Selector mencari entry berdasarkan id dari Redux (Modul V.1)
  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id)),
  );

  if (!entry) {
    return (
      <View style={styles.outer}>
        <View style={styles.container}>
          <Text style={styles.notFound}>Diary tidak ditemukan.</Text>
        </View>
      </View>
    );
  }

  // DELETE State (Modul V.1)
  const confirmDelete = () => {
    Alert.alert("Hapus Diary", "Diary akan dihapus dari Redux Store.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          dispatch(deleteDiary(entry.id));
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.outer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.moodBox}>
            <Text style={styles.mood}>{entry.mood}</Text>
          </View>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.date}>📅 {entry.date}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{entry.body}</Text>
        </View>

        {/* Tombol aksi */}
        <View style={styles.actionGroup}>
          <Pressable
            onPress={() => dispatch(toggleFavorite(entry.id))}
            style={[
              styles.actionButton,
              entry.liked ? styles.favoriteActiveButton : styles.favoriteButton,
            ]}
          >
            <Text style={styles.white}>
              {entry.liked ? "❤️ Hapus dari Favorite" : "🤍 Tambah ke Favorite"}
            </Text>
          </Pressable>

          {/* Tombol Edit Diary (Tugas Praktikum AD.2) */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/edit/[id]",
                params: { id: String(entry.id) },
              })
            }
            style={[styles.actionButton, styles.editButton]}
          >
            <Text style={styles.white}>✏️ Edit Diary</Text>
          </Pressable>

          <Pressable
            onPress={confirmDelete}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Text style={styles.white}>🗑️ Hapus Diary</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    width: "100%",
    maxWidth: 600,
    paddingHorizontal: SPACE.l,
    paddingTop: SPACE.xl,
    paddingBottom: 40,
    gap: SPACE.l,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACE.xl,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACE.m,
  },
  mood: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  date: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: SPACE.m,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACE.m,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
  },
  actionGroup: {
    gap: SPACE.m,
  },
  actionButton: {
    padding: 16,
    alignItems: "center",
    borderRadius: RADIUS.card,
  },
  favoriteButton: {
    backgroundColor: COLORS.accent,
  },
  favoriteActiveButton: {
    backgroundColor: "#DC2626",
  },
  editButton: {
    backgroundColor: "#F59E0B",
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  white: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  notFound: {
    padding: 20,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 16,
  },
});
