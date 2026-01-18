import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Image } from 'expo-image';
import { useState, useEffect } from "react";
import { getCuratedWallpapers } from "../../api/pexels";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 24) / 2; // 2 columns with padding

export default function HomeScreen() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const loadWallpapers = async (pageNum = 1) => {
    try {
      setLoading(true);
      console.log("Loading wallpapers, page:", pageNum);
      const data = await getCuratedWallpapers(pageNum);
      console.log("Loaded", data?.length, "wallpapers");
      if (pageNum === 1) {
        setWallpapers(data || []);
      } else {
        setWallpapers(prev => [...prev, ...(data || [])]);
      }
    } catch (error) {
      console.error("Error loading wallpapers:", error);
      setWallpapers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadWallpapers(1);
  };

  const loadMore = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadWallpapers(nextPage);
    }
  };

  const renderItem = ({ item, index }) => {
    const imageHeight = (item.height / item.width) * COLUMN_WIDTH;
    
    return (
      <TouchableOpacity
        style={[styles.imageContainer, { width: COLUMN_WIDTH }]}
        onPress={() => {
          // Navigate to details or full screen view
          console.log("Image pressed:", item.id);
        }}
      >
        <Image
          source={{ uri: item.src.medium }}
          style={[styles.image, { height: imageHeight }]}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.photographerTag}>
          <Text style={styles.photographerText} numberOfLines={1}>
            📸 {item.photographer}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && wallpapers.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading beautiful wallpapers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Discover Wallpapers</Text>
        <Text style={styles.headerSubtitle}>Curated collection of stunning images</Text>
      </View>
      
      <FlatList
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#6366f1" />
            </View>
          ) : (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Developed by Sankalp with ❤️</Text>
            </View>
          )
        }
      />
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
    backgroundColor: "#0f0f0f",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9ca3af",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
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
  photographerTag: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  photographerText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "500",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
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
