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

      // Request media library write permission (writeOnly is correct for saving)
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow photo/media access so WallCraft can save wallpapers to your gallery."
        );
        setDownloading(false);
        return;
      }

      // Use cacheDirectory — reliably accessible by MediaLibrary on all Android versions
      const fileUri =
        FileSystem.cacheDirectory + `wallpaper_${Date.now()}.jpg`;

      const downloadedFile = await FileSystem.downloadAsync(image, fileUri);

      if (downloadedFile.status !== 200) {
        throw new Error(`Download failed with HTTP status ${downloadedFile.status}`);
      }

      await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);

      // Clean up the temp cache file after saving
      await FileSystem.deleteAsync(downloadedFile.uri, { idempotent: true });

      Alert.alert("Downloaded ✅", "Wallpaper saved to your gallery!");
    } catch (err) {
      console.error("[DetailsScreen] Download error:", err);
      Alert.alert(
        "Download Failed ❌",
        "Could not save the wallpaper. Please check your internet connection and try again."
      );
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
