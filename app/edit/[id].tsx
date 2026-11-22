import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import { editDiary } from "../../src/features/diary/diarySlice";
import { COLORS, RADIUS, SPACE } from "../../src/styles/tokens";

const MOODS = ["😊", "😌", "🔥", "😢", "😴"];

export default function EditScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Ambil data diary yang akan diedit dari Redux Store (Tugas Praktikum AD.2)
  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id)),
  );

  const [title, setTitle] = useState(entry?.title ?? "");
  const [body, setBody] = useState(entry?.body ?? "");
  const [mood, setMood] = useState(entry?.mood ?? "😊");

  if (!entry) {
    return (
      <View style={styles.outer}>
        <View style={styles.container}>
          <Text style={styles.notFound}>Diary tidak ditemukan.</Text>
        </View>
      </View>
    );
  }

  const handleUpdate = () => {
    // Validasi dasar (Tugas Praktikum AD.6)
    if (!title.trim() || !body.trim()) {
      Alert.alert("Validasi", "Judul dan isi wajib diisi");
      return;
    }
    if (title.trim().length < 3) {
      Alert.alert("Validasi", "Judul minimal harus 3 karakter");
      return;
    }

    // Dispatch action editDiary ke Redux Store (Tugas Praktikum AD.1 & AD.2)
    dispatch(
      editDiary({
        id: entry.id,
        title: title.trim(),
        body: body.trim(),
        mood,
      }),
    );

    router.back();
  };

  return (
    <View style={styles.outer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Edit Diary</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Judul Diary</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Judul diary (min. 3 karakter)"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Isi Cerita</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Ceritakan harimu..."
            placeholderTextColor={COLORS.muted}
            multiline
            style={[styles.input, styles.bodyInput]}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pilih Mood</Text>
          <View style={styles.moodRow}>
            {MOODS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setMood(item)}
                style={[
                  styles.moodButton,
                  mood === item && styles.selectedMood,
                ]}
              >
                <Text style={styles.mood}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
        </Pressable>
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
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: 14,
    fontSize: 15,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  bodyInput: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  moodRow: {
    flexDirection: "row",
    gap: SPACE.s,
  },
  moodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  selectedMood: {
    borderColor: "#F59E0B",
    borderWidth: 2,
    backgroundColor: "#FEF3C7",
  },
  mood: {
    fontSize: 28,
  },
  button: {
    padding: 16,
    borderRadius: RADIUS.card,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  notFound: {
    padding: 20,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 16,
  },
});
