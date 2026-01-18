import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function DetailsScreen({ route }) {
  const { image } = route.params;
  const [downloading, setDownloading] = useState(false);

  const downloadWallpaper = async () => {
    try {
      setDownloading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Needed", "Allow storage permission to download.");
        setDownloading(false);
        return;
      }

      const fileUri = FileSystem.documentDirectory + `wallpaper_${Date.now()}.jpg`;

      const downloadedFile = await FileSystem.downloadAsync(image, fileUri);
      await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);

      Alert.alert("Downloaded ✅", "Wallpaper saved to your gallery!");
    } catch (err) {
      Alert.alert("Error ❌", "Download failed!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Image
        source={{ uri: image }}
        style={{ flex: 1, resizeMode: "cover" }}
      />

      <TouchableOpacity
        onPress={downloadWallpaper}
        style={{
          position: "absolute",
          bottom: 30,
          alignSelf: "center",
          backgroundColor: "#7c3aed",
          paddingVertical: 14,
          paddingHorizontal: 25,
          borderRadius: 15,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {downloading ? "Downloading..." : "⬇ Download Wallpaper"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
