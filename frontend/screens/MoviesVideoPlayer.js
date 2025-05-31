import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { useEffect, useState } from "react";
import { getWatchTime, updateWatchTime } from "../api/userMovieWatchtimeAPI";

const MoviesVideoPlayer = ({ route }) => {
  const { movieLink, movieId } = route.params;
  const [progress, setProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);

  const player = useVideoPlayer(movieLink, (player) => {
    player.loop = true;
    player.play();
    player.timeUpdateEventInterval = 1;
    player.showNowPlayingNotification = true;
    player.staysActiveInBackground = true;
  });

  useEventListener(player, "timeUpdate", (payload) => {
    setProgress(payload.currentTime);
  });

  useEffect(() => {
    const updateWatchedTime = async () => {
      if (!isNaN(progress)) {
        await updateWatchTime(parseInt(progress), movieId);
      }
    };

    updateWatchedTime();
  }, [progress]);

  useEffect(() => {
    const fetchWatchedTime = async () => {
      try {
        const response = await getWatchTime(movieId);
        setWatchedTime(response.watchedTime);
      } catch (error) {
        console.error("Error fetching watched time:", error);
      }
    };

    fetchWatchedTime();
  }, [movieId]);

  useEffect(() => {
    if (player && watchedTime > 0) {
      player.currentTime = watchedTime;
    }
  }, [player, watchedTime]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View>
        <TouchableOpacity activeOpacity={1}>
          <VideoView
            style={{ width: "100%", height: "100%" }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            allowsVideoFrameAnalysis
            startsPictureInPictureAutomatically
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MoviesVideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
