import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, Alert } from "react-native";
import { File, Directory, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default function DetailsScreen({ route }) {
  const { image } = route.params;
  const [downloading, setDownloading] = useState(false);

  const downloadWallpaper = async () => {
    try {
      setDownloading(true);

      // Download the image to a cache directory using the new File API (SDK v54+)
      const cacheDir = new Directory(Paths.cache, "wallpapers");
      cacheDir.create();
      const downloadedFile = await File.downloadFileAsync(image, cacheDir);

      if (!downloadedFile.exists) {
        throw new Error("Download failed — file does not exist after download.");
      }

      // Try saving directly to gallery via MediaLibrary (works in dev/production builds)
      let savedToGallery = false;
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync(true);
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);
          savedToGallery = true;
        }
      } catch (mediaError) {
        // MediaLibrary permission fails in Expo Go on Android 13+ — fall back to sharing
        console.warn("[DetailsScreen] MediaLibrary unavailable, using share fallback:", mediaError.message);
      }

      if (savedToGallery) {
        downloadedFile.delete();
        Alert.alert("Downloaded ✅", "Wallpaper saved to your gallery!");
      } else {
        // Fallback: open system share sheet so the user can save manually
        const sharingAvailable = await Sharing.isAvailableAsync();
        if (sharingAvailable) {
          await Sharing.shareAsync(downloadedFile.uri, {
            mimeType: "image/jpeg",
            dialogTitle: "Save Wallpaper",
          });
          downloadedFile.delete();
        } else {
          downloadedFile.delete();
          Alert.alert(
            "Sharing Unavailable",
            "Could not save or share the wallpaper on this device."
          );
        }
      }
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
