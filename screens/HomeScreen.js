import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { getCuratedWallpapers } from "../api/pexels";

export default function HomeScreen({ navigation }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadWallpapers = async () => {
    setLoading(true);
    const data = await getCuratedWallpapers(page);
    setWallpapers((prev) => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    loadWallpapers();
  }, [page]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Search Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={{
          backgroundColor: "#7c3aed",
          padding: 12,
          borderRadius: 12,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          🔍 Search Wallpapers
        </Text>
      </TouchableOpacity>

      <FlatList
        data={wallpapers}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flex: 1, margin: 6 }}
            onPress={() =>
              navigation.navigate("Details", {
                image: item.src.portrait,
              })
            }
          >
            <Image
              source={{ uri: item.src.medium }}
              style={{ height: 220, borderRadius: 15 }}
            />
          </TouchableOpacity>
        )}
        onEndReached={() => setPage((prev) => prev + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" style={{ margin: 20 }} /> : null
        }
      />
    </View>
  );
}
