import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllGenres, showsListAPI } from "../api/showsListAPI";
import { useNavigation } from "@react-navigation/native";
import ShowBanner from "../components/ShowBanner";
import { showsMylist } from "../api/myListAPI";
import MylistShows from "../components/MylistShows";
import BlankComponent from "../components/BlankComponent";
import ShowCards from "../components/ShowCards";
import { getLatestWatchedEpisodeID } from "../api/userShowWatchtimeAPI";

export default function ShowsScreen() {
  const navigation = useNavigation();

  const [showsList, setShowsList] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [userShowsMylist, setUserShowsMylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const showsListApiCall = async () => {
      const shows = await showsListAPI();
      setShowsList(shows);
      setIsLoading(false);
    };

    showsListApiCall();
  }, []);

  useEffect(() => {
    const fetchShowsMylist = async () => {
      const updatedShowsMylist = await showsMylist();

      setUserShowsMylist(updatedShowsMylist.showsInMyList);
    };

    fetchShowsMylist();
  }, []);

  useEffect(() => {
    const fetchAllGenres = async () => {
      const genres = await getAllGenres();
      setAllGenres(genres);
    };

    fetchAllGenres();
  }, []);

  const updateUserShowMylist = (newList) => {
    setUserShowsMylist(newList);
  };

  const handleBanner = (show) => {
    navigation.navigate("ShowsDetailsScreen", {
      show: show,
    });
  };

  const posterPlayButton = async (show) => {
    try {
      const latestWatchedEpisodeId = await getLatestWatchedEpisodeID(show._id);
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

  const posterInfoButton = (show) => {
    navigation.navigate("ShowsDetailsScreen", {
      show: show,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <ShowBanner
          showsList={showsList}
          showMylist={userShowsMylist}
          handleBanner={handleBanner}
          posterPlayButton={posterPlayButton}
          posterInfoButton={posterInfoButton}
          updateUserShowMylist={updateUserShowMylist}
          isLoading={isLoading}
        />

        <View style={styles.subContainer}>
          {userShowsMylist.length != 0 && (
            <MylistShows
              label="My List"
              userShowsMylist={userShowsMylist}
              handleBanner={handleBanner}
            />
          )}

          {allGenres.map((genre) => (
            <ShowCards
              key={genre}
              genre={genre}
              showsList={showsList}
              handleBanner={handleBanner}
              isLoading={isLoading}
            />
          ))}
          <BlankComponent />
        </View>
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
  subContainer: {
    paddingHorizontal: 15,
    gap: 10,
    marginTop: 20,
  },
});
