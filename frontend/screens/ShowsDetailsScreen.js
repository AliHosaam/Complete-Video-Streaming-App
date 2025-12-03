import { StyleSheet, View, StatusBar, ScrollView } from "react-native";
import ShowDetails from "../components/showDetails";
import ShowSeasonsDetails from "../components/ShowSeasonsDetails";
import RelatedShows from "../components/RelatedShows";
import BlankComponent from "../components/BlankComponent";
import { getLatestWatchedEpisodeID } from "../api/userShowWatchtimeAPI";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function ShowsDetailsScreen({ route }) {
  const [playOrResume, setPlayOrResume] = useState("Play");

  const navigation = useNavigation();
  const { show } = route.params;

  useFocusEffect(
    useCallback(() => {
      const checkLatestEpisode = async () => {
        try {
          const latestWatchedEpisode = await getLatestWatchedEpisodeID(
            show._id
          );

          if (latestWatchedEpisode?.episodeId?.episode) {
            for (const season of show.seasons) {
              const foundEpisode = season.episodes.find(
                (ep) =>
                  ep._id.toString() === latestWatchedEpisode.episodeId.episode
              );

              if (foundEpisode) {
                setPlayOrResume("Resume");
                return;
              }
            }
          }

          setPlayOrResume("Play");
        } catch (error) {
          console.error("Error checking latest episode:", error);
          setPlayOrResume("Play");
        }
      };

      checkLatestEpisode();
    }, [show._id, show.seasons])
  );

  const handlePlayFirstEpisode = async (showId) => {
    try {
      const latestWatchedEpisodeId = await getLatestWatchedEpisodeID(showId);
      let episodeId = latestWatchedEpisodeId?.episodeId?.episode;
      let episodeLink = "";
      let episodeName = "";
      let episodeNumber = "";

      if (episodeId) {
        for (const season of show.seasons) {
          const foundEpisode = season.episodes.find(
            (ep) => ep._id.toString() === episodeId
          );

          if (foundEpisode) {
            episodeLink = foundEpisode.downloadLink;
            episodeName = foundEpisode.name;
            episodeNumber = foundEpisode.episode_number;

            navigation.navigate("ShowsVideoPlayer", {
              episodeId: episodeId,
              episodeLink: episodeLink,
              episodeName: episodeName,
              episodeNumber: episodeNumber,
              seasonNumber: season.season_number,
            });
            return;
          }
        }
      }

      if (
        show.seasons &&
        show.seasons.length > 0 &&
        show.seasons[0].episodes &&
        show.seasons[0].episodes.length > 0
      ) {
        const firstEpisode = show.seasons[0].episodes[0];

        navigation.navigate("ShowsVideoPlayer", {
          episodeId: firstEpisode._id,
          episodeLink: firstEpisode.downloadLink,
          episodeName: firstEpisode.name,
          episodeNumber: firstEpisode.episode_number,
          seasonNumber: show.seasons[0].season_number,
        });
      } else {
        Alert.alert("Error", "No episodes available for this show");
      }
    } catch (error) {
      console.error("Error fetching the show watch time api:", error);
      Alert.alert("Error", "Failed to load episode. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <ShowDetails
          show={show}
          handlePlayFirstEpisode={handlePlayFirstEpisode}
          playOrResume={playOrResume}
        />

        {show.length !== 0 && <ShowSeasonsDetails show={show} />}

        <RelatedShows showId={show._id} />

        <BlankComponent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
});
