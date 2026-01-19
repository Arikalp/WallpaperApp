import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, TextInput, Animated } from "react-native";
import { Image } from 'expo-image';
import { useState, useEffect, useRef } from "react";
import { searchWallpapers } from "../../api/pexels";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 24) / 2;

const POPULAR_CATEGORIES = [
  { id: 1, name: "Nature", emoji: "🌿" },
  { id: 2, name: "Cars", emoji: "🚗" },
  { id: 3, name: "Anime", emoji: "🎭" },
  { id: 4, name: "Space", emoji: "🌌" },
  { id: 5, name: "Gaming", emoji: "🎮" },
  { id: 6, name: "Minimal", emoji: "⚪" },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setSearched(true);
      const data = await searchWallpapers(query);
      setWallpapers(data || []);
    } catch (error) {
      console.error("Error searching wallpapers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    setSearchQuery(categoryName);
    handleSearch(categoryName);
  };

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.name)}
    >
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderWallpaperItem = ({ item }: any) => {
    const imageHeight = (item.height / item.width) * COLUMN_WIDTH;
    
    return (
      <TouchableOpacity
        style={[styles.imageContainer, { width: COLUMN_WIDTH }]}
        onPress={() => router.push({
          pathname: '/modal',
          params: { 
            wallpaper: JSON.stringify(item)
          }
        })}
      >
        <Image
          source={{ uri: item.src.medium }}
          style={[styles.image, { height: imageHeight }]}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎨</Text>
            <Text style={styles.headerTitle}>WallCraft</Text>
          </View>
        </Animated.View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search wallpapers..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(searchQuery)}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!searched ? (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <FlatList
            data={POPULAR_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.footer}>
                <Text style={styles.footerText}>Developed by Sankalp with ❤️</Text>
              </View>
            }
          />
        </View>
      ) : loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : wallpapers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsEmoji}>😕</Text>
          <Text style={styles.noResultsText}>No wallpapers found</Text>
          <Text style={styles.noResultsSubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={wallpapers}
          renderItem={renderWallpaperItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerText}>Developed by Sankalp with ❤️</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 36,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -1,

  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  searchButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  categoriesContent: {
    paddingBottom: 20,
  },
  categoryRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  categoryEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9ca3af",
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
  listContainer: {
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1f1f1f",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  image: {
    width: "100%",
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
});
