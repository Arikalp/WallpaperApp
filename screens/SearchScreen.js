import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { searchWallpapers } from "../api/pexels";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await searchWallpapers(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Search wallpapers (nature, cars, anime...)"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 12,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleSearch}
        style={{
          backgroundColor: "#7c3aed",
          padding: 12,
          borderRadius: 12,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          🔎 Search
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
      />
    </View>
  );
}
