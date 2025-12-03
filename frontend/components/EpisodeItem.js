import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const EpisodeItem = ({ episode, seasonNumber }) => {
  const navigation = useNavigation();

  console.log(episode);

  const handleVideoPlayer = (episodeId, episodeLink, episodeName) => {
    navigation.navigate("ShowsVideoPlayer", {
      episodeId: episodeId,
      episodeLink: episodeLink,
      episodeName: episodeName,
      episodeNumber: episode.episode_number,
      seasonNumber: seasonNumber,
    });
  };

  return (
    <View style={styles.episodeContainer}>
      <View style={styles.rowContainer}>
        {episode.posterPath && episode.runtime > 0 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              handleVideoPlayer(episode._id, episode.downloadLink, episode.name)
            }
          >
            <Image
              source={{ uri: episode.posterPath }}
              style={styles.posterPath}
            />
            <View style={styles.playButtonContainer}>
              <Icon
                style={styles.playButton}
                name="play-circle"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.placeholderContainer} />

            <View style={styles.playButtonContainer}>
              <Icon
                style={styles.playButton}
                name="play-circle"
                size={30}
                color="white"
              />
            </View>
          </View>
        )}

        <View style={styles.episodeDetails}>
          <Text style={styles.episodeNumber}>
            {episode.episode_number && episode.name
              ? `${episode.episode_number}. ${episode.name}`
              : "No episode number or name available"}
          </Text>
          <View style={styles.runtimeContainer}>
            <EntypoIcon name="clock" size={12} color="white" />
            <Text style={styles.episodeRunTime}>{episode.runtime} min</Text>
          </View>
        </View>
      </View>

      <Text style={styles.episodeOverview}>
        {episode.overview ? episode.overview : "No overview available"}
      </Text>
      <View style={styles.divider} />
    </View>
  );
};

export default EpisodeItem;

const styles = StyleSheet.create({
  episodeContainer: {
    marginBottom: 20,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  posterPath: {
    width: responsiveWidth(30),
    height: responsiveHeight(8),
    marginRight: 15,
    borderRadius: 5,
    resizeMode: "cover",
    opacity: 0.9,
  },
  episodeDetails: {
    flex: 1,
  },
  episodeNumber: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
  runtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  episodeRunTime: {
    color: "white",
    fontSize: responsiveFontSize(1.8),
    fontWeight: "bold",
    marginVertical: 5,
  },
  episodeOverview: {
    color: "grey",
    fontSize: responsiveFontSize(1.5),
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    zIndex: 1,
  },
  divider: {
    height: 1,
    marginTop: 15,
    backgroundColor: "#333",
    marginRight: 60,
  },
  placeholderContainer: {
    width: responsiveWidth(30),
    height: responsiveHeight(8),
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
});
