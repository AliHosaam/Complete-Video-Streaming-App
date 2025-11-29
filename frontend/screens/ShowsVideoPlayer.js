import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  Image,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { useEffect, useState, useRef } from "react";
import { getShowWatchTime, updateWatchTime } from "../api/userShowWatchtimeAPI";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";
import VerticalSlider from "rn-vertical-slider-matyno";
import * as Brightness from "expo-brightness";
import DoubleTap from "../components/DoubleTap";
import { getAllEpisodesList } from "../api/showsListAPI";

const ShowsVideoPlayer = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { episodeLink, episodeId, episodeName } = route.params;

  const [watchedTime, setWatchedTime] = useState(0);
  const [videoPressed, setVideoPressed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [duration, setDuration] = useState(0);
  const [brightnessLevel, setBrightnessLevel] = useState(0);
  const [episodeList, setEpisodeList] = useState([]);
  const [episodeListVisible, setEpisodeListVisible] = useState(false);

  const videoRef = useRef(null);
  const orientationLockTimeout = useRef(null);

  const player = useVideoPlayer(episodeLink, (player) => {
    player.loop = false;
    player.play();
    player.timeUpdateEventInterval = 1;
    player.showNowPlayingNotification = true;
    player.staysActiveInBackground = true;
    player.allowsExternalPlayback = true;
  });

  useEffect(() => {
    if (orientationLockTimeout.current) {
      clearTimeout(orientationLockTimeout.current);
    }

    if (isFocused) {
      orientationLockTimeout.current = setTimeout(async () => {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          );
        } catch (error) {
          console.error("Error locking orientation:", error);
        }
      }, 100);
    } else {
      (async () => {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } catch (error) {
          console.error("Error unlocking orientation:", error);
        }
      })();
    }

    return () => {
      if (orientationLockTimeout.current) {
        clearTimeout(orientationLockTimeout.current);
      }

      (async () => {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } catch (error) {
          console.error("Error in cleanup:", error);
        }
      })();
    };
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        const current = await Brightness.getBrightnessAsync();
        setBrightnessLevel(current);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchWatchedTime = async () => {
      try {
        const response = await getShowWatchTime(episodeId);
        setWatchedTime(response.watchedTime);
      } catch (error) {
        console.error("Error fetching watched time:", error);
      }
    };
    fetchWatchedTime();
  }, [episodeId]);

  useEffect(() => {
    if (player && watchedTime > 0) {
      player.currentTime = watchedTime;
    }
  }, [player, watchedTime]);

  useEffect(() => {
    const episodesList = async () => {
      const episodes = await getAllEpisodesList(episodeId);

      setEpisodeList(episodes.seasonArray);
    };

    episodesList();
  }, []);

  useEventListener(player, "statusChange", (payload) => {
    const status = payload.status;
    if (status === "loading") {
      setIsBuffering(true);
    } else if (status === "readyToPlay") {
      setIsBuffering(false);
      setDuration(player.duration || 0);
    } else if (status === "error") {
      setIsBuffering(false);
    }
  });

  useEventListener(player, "timeUpdate", (payload) => {
    setProgress(payload.currentTime);
  });

  const handleVideoPressed = () => {
    setVideoPressed(!videoPressed);
  };

  const moveBackwards = () => {
    try {
      if (player && player.currentTime !== undefined) {
        const newTime = Math.max(0, player.currentTime - 10);
        player.currentTime = newTime;
        setProgress(newTime);
      }
    } catch (error) {
      console.error("Error in moveBackwards:", error);
    }
  };

  const moveForwards = () => {
    try {
      if (player && player.currentTime !== undefined) {
        const newTime = Math.min(duration, player.currentTime + 10);
        player.currentTime = newTime;
        setProgress(newTime);
      }
    } catch (error) {
      console.error("Error in moveForwards:", error);
    }
  };

  const handlePlayVideo = () => {
    setIsPaused(false);
    if (player) player.play();
  };

  const handlePauseVideo = () => {
    setIsPaused(true);
    if (player) player.pause();
  };

  const formatDuration = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedHours =
      hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
    const formattedMinutes = String(minutes).padStart(2, "0") + ":";
    const formattedSeconds = String(seconds).padStart(2, "0");

    return formattedHours + formattedMinutes + formattedSeconds;
  };

  const handleVolumeUp = () => {
    setIsMuted(false);
    if (player) player.muted = false;
  };

  const handleMute = () => {
    setIsMuted(true);
    if (player) player.muted = true;
  };

  const handleZoomIn = () => setZoomedIn(true);

  const handleZoomOut = () => setZoomedIn(false);

  const handleUpdateShowWatchTime = async () => {
    if (!isNaN(progress)) {
      const showId = await getAllEpisodesList(episodeId);
      await updateWatchTime(parseInt(progress), showId.showId, episodeId);
    }
  };

  const goBack = async () => {
    try {
      handleUpdateShowWatchTime();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error("Error in goBack:", error);
    }

    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const handleBrightnessChange = async (value) => {
    setBrightnessLevel(value);

    try {
      await Brightness.setBrightnessAsync(value);
    } catch (error) {
      console.error("Failed to set brightness:", error);
    }
  };

  const showAirPlayInfo = () => {
    Alert.alert(
      "📺 Cast to TV",
      'To watch on your TV:\n\n1. Swipe down from the top-right corner\n2. Tap "Screen Mirroring"\n3. Select your Apple TV or Smart TV\n\nYour video will appear on the TV!',
      [{ text: "Got it!" }]
    );
  };

  const openEpisodeListModal = async () => {
    handlePauseVideo();
    setEpisodeListVisible(true);
  };

  const closeEpisodeListModal = async () => {
    setEpisodeListVisible(false);
  };

  const handleEpisodePlay = async (episodeId, episodeLink, episodeName) => {
    closeEpisodeListModal();

    handleUpdateShowWatchTime();

    navigation.navigate("ShowsVideoPlayer", {
      episodeId: episodeId,
      episodeLink: episodeLink,
      episodeName: episodeName,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <TouchableOpacity activeOpacity={1} style={styles.backgroundVideo}>
        <VideoView
          ref={videoRef}
          style={[styles.video, zoomedIn ? styles.zoomIn : styles.zoomOut]}
          player={player}
          fullscreenOptions={false}
          allowsPictureInPicture
          startsPictureInPictureAutomatically
          nativeControls={false}
        />

        {episodeListVisible && (
          <View style={styles.episodeListOverlay}>
            <View style={styles.episodeListContainer}>
              <View style={styles.episodeListHeader}>
                <Text style={styles.episodeListTitle}>Episodes</Text>
                <TouchableOpacity onPress={closeEpisodeListModal}>
                  <Icon name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={episodeList}
                keyExtractor={(item, index) =>
                  item._id?.toString() || index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.episodeItem}
                    onPress={() =>
                      handleEpisodePlay(item._id, item.downloadLink, item.name)
                    }
                  >
                    <View style={styles.episodeContent}>
                      {item.posterPath ? (
                        <Image
                          source={{ uri: item.posterPath }}
                          style={styles.episodePoster}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.episodePosterPlaceholder}>
                          <Icon name="movie" size={30} color="#666" />
                        </View>
                      )}

                      <View style={styles.episodeDetails}>
                        <Text style={styles.episodeItemText} numberOfLines={2}>
                          {item.episode_number
                            ? `${item.episode_number}. `
                            : ""}
                          {item.name}
                        </Text>
                        {item.overview && (
                          <Text
                            style={styles.episodeOverview}
                            numberOfLines={3}
                          >
                            {item.overview}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleVideoPressed}
          style={[
            styles.videoScreenContainer,
            {
              backgroundColor: videoPressed
                ? "rgba(0,0,0,0.5)"
                : "rgba(0,0,0,0)",
            },
          ]}
        >
          {!isBuffering ? (
            <View
              style={{ opacity: videoPressed ? 1 : 0, flexDirection: "row" }}
            >
              <TouchableOpacity onPress={moveBackwards}>
                <Image
                  source={require("../assets/images/backward.png")}
                  style={{ width: 50, height: 50, tintColor: "white" }}
                />
              </TouchableOpacity>

              {isPaused ? (
                <TouchableOpacity onPress={handlePlayVideo}>
                  <Image
                    source={require("../assets/images/play.png")}
                    style={{
                      width: 50,
                      height: 50,
                      tintColor: "white",
                      marginRight: responsiveWidth(10),
                      marginLeft: responsiveWidth(10),
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handlePauseVideo}>
                  <Image
                    source={require("../assets/images/pause.png")}
                    style={{
                      width: 50,
                      height: 50,
                      tintColor: "white",
                      marginRight: responsiveWidth(10),
                      marginLeft: responsiveWidth(10),
                    }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={moveForwards}>
                <Image
                  source={require("../assets/images/forward.png")}
                  style={{ width: 50, height: 50, tintColor: "white" }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          <View
            style={[
              styles.backButtonContainer,
              { opacity: videoPressed ? 1 : 0 },
            ]}
          >
            <TouchableOpacity onPress={goBack}>
              <Image
                source={require("../assets/images/arrow.png")}
                style={styles.goBackIcon}
              />
            </TouchableOpacity>
            <Text style={styles.showTitleText}>{episodeName}</Text>
            {Platform.OS === "ios" && (
              <TouchableOpacity onPress={showAirPlayInfo}>
                <Icon name="cast" size={35} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <DoubleTap position="left" onDoubleTap={moveBackwards} />
          <DoubleTap position="right" onDoubleTap={moveForwards} />

          <View
            style={{
              width: "15%",
              height: "40%",
              flexDirection: "column",
              gap: 10,
              position: "absolute",
              bottom: 120,
              left: 0,
              paddingLeft: 60,
              paddingRight: 0,
              alignItems: "center",
              opacity: videoPressed ? 1 : 0,
            }}
          >
            <Icon name="brightness-7" size={30} color="white" />
            <VerticalSlider
              onChange={handleBrightnessChange}
              value={brightnessLevel}
              disabled={false}
              width={20}
              height={100}
              min={0.1}
              max={1}
              step={0.1}
              borderRadius={2}
              minimumTrackTintColor="#daa520"
              maximumTrackTintColor="grey"
            />
          </View>

          <View
            style={[styles.sliderContainer, { opacity: videoPressed ? 1 : 0 }]}
          >
            <Text style={styles.sliderText}>{formatDuration(progress)}</Text>
            <Slider
              style={styles.sliderProgressBar}
              minimumValue={0}
              maximumValue={duration}
              minimumTrackTintColor="#daa520"
              maximumTrackTintColor="grey"
              thumbTintColor="#daa520"
              value={progress}
              onValueChange={(value) => {
                player.currentTime = value;
                setProgress(value);
              }}
              onSlidingStart={() => {
                player.pause();
              }}
              onSlidingComplete={() => {
                if (!isPaused) {
                  player.play();
                }
              }}
            />
            <Text style={styles.sliderText}>{formatDuration(duration)}</Text>
          </View>

          {!isBuffering && (
            <View
              style={[
                styles.audioSubsIconContainer,
                { opacity: videoPressed ? 1 : 0 },
              ]}
            >
              {isMuted ? (
                <TouchableOpacity onPress={handleVolumeUp}>
                  <Image
                    source={require("../assets/images/mute.png")}
                    style={{
                      width: 40,
                      height: 40,
                      tintColor: "white",
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleMute}>
                  <Image
                    source={require("../assets/images/volume.png")}
                    style={{
                      width: 40,
                      height: 40,
                      tintColor: "white",
                    }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  marginRight: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={openEpisodeListModal}
              >
                <Image
                  source={require("../assets/images/books.png")}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: "white",
                  }}
                />
                <Text style={styles.episodeText}>Episodes</Text>
              </TouchableOpacity>

              {!zoomedIn ? (
                <TouchableOpacity onPress={handleZoomIn}>
                  <Icon name="zoom-in-map" size={35} color="white"></Icon>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleZoomOut}>
                  <Icon name="zoom-out-map" size={35} color="white"></Icon>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default ShowsVideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  zoomIn: {
    width: "130%",
    height: "130%",
    marginLeft: "-15%",
  },
  zoomOut: {
    width: "100%",
    height: "100%",
  },
  backgroundVideo: {
    width: "100%",
    height: "100%",
  },
  videoScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sliderProgressBar: {
    flex: 1,
    color: "daa520",
    bottom: 40,
  },
  sliderContainer: {
    width: "90%",
    height: "25%",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderText: {
    color: "white",
    bottom: 40,
    marginHorizontal: 10,
  },
  audioSubsIconContainer: {
    width: "80%",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
  },
  episodeText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginLeft: 10,
  },
  backButtonContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    top: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  showTitleText: {
    color: "white",
    flex: 1,
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    textAlign: "center",
  },
  episodeListOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  episodeListContainer: {
    width: "85%",
    height: "85%",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 20,
  },
  episodeListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#daa520",
  },
  episodeListTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    color: "white",
  },
  episodeItem: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#252525",
    overflow: "hidden",
  },
  episodeContent: {
    flexDirection: "row",
    padding: 10,
  },
  episodePoster: {
    width: responsiveWidth(20),
    height: responsiveWidth(12),
    borderRadius: 5,
    backgroundColor: "#333",
  },
  episodePosterPlaceholder: {
    width: responsiveWidth(20),
    height: responsiveWidth(12),
    borderRadius: 5,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  episodeDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  episodeItemText: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  episodeOverview: {
    fontSize: responsiveFontSize(1.5),
    color: "#aaa",
    lineHeight: 18,
  },
});
