import { useRouter } from "expo-router";
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
import { useAppDispatch } from "../../src/app/hooks";
import { addDiary } from "../../src/features/diary/diarySlice";
import { COLORS, RADIUS, SPACE } from "../../src/styles/tokens";

const MOODS = ["😊", "😌", "🔥", "😢", "😴"];

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Local state untuk form input (Modul T.1 & Tabel D)
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("😊");

  const saveDiary = () => {
    // Validasi dasar (Tugas Praktikum AD.6)
    if (!title.trim() || !body.trim()) {
      Alert.alert("Validasi", "Judul dan isi wajib diisi");
      return;
    }
    if (title.trim().length < 3) {
      Alert.alert("Validasi", "Judul minimal harus 3 karakter");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    // Dispatch action addDiary ke Redux Store (Modul T.1)
    dispatch(
      addDiary({
        title: title.trim(),
        date: today,
        preview: body.trim().slice(0, 100),
        body: body.trim(),
        mood,
      }),
    );

    setTitle("");
    setBody("");
    setMood("😊");
    router.replace("/");
  };

  return (
    <View style={styles.outer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Tambah Diary</Text>

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

        <Pressable onPress={saveDiary} style={styles.button}>
          <Text style={styles.buttonText}>Simpan ke Redux</Text>
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
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: "#EFF6FF",
  },
  mood: {
    fontSize: 28,
  },
  button: {
    padding: 16,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
