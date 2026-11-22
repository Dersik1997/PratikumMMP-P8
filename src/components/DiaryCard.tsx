import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACE, TYPO } from "../styles/tokens";

type Props = {
  title: string;
  date: string;
  preview: string;
  mood: string;
  liked: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export default function DiaryCard({
  title,
  date,
  preview,
  mood,
  liked,
  onPress,
  onToggleFavorite,
}: Props) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.main}>
        <View style={styles.moodBox}>
          <Text style={styles.mood}>{mood}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
        accessibilityRole="button"
        accessibilityLabel="Toggle Favorite"
      >
        <Text style={[styles.favorite, liked && styles.favoriteActive]}>
          {liked ? "♥" : "♡"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    marginBottom: SPACE.m,
    overflow: "hidden",
  },
  main: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.m,
    padding: SPACE.m,
  },
  moodBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },
  mood: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: TYPO.title,
    fontWeight: "700",
    color: COLORS.text,
  },
  date: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginVertical: 3,
  },
  preview: {
    fontSize: TYPO.body,
    color: COLORS.text,
    lineHeight: 19,
  },
  favoriteButton: {
    paddingHorizontal: SPACE.l,
    paddingVertical: SPACE.m,
    justifyContent: "center",
    alignItems: "center",
  },
  favorite: {
    fontSize: 26,
    color: "#9CA3AF",
  },
  favoriteActive: {
    color: COLORS.danger,
  },
});
