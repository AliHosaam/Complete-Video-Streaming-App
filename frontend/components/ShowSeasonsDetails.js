import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EpisodeItem from "./EpisodeItem";
import { Skeleton } from "moti/skeleton";

const ShowSeasonsDetails = ({ show }) => {
  const [selectedSeasonsIndex, setSelectedSeasonsIndex] = useState(0);
  const [isModalAvailable, setIsModalAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  const renderEpisodeItem = ({ item }) => <EpisodeItem episode={item} />;

  const openSeasonSelector = () => {
    setIsModalAvailable(true);
  };

  const handleSeasonChange = (index) => {
    setSelectedSeasonsIndex(index);
    setIsModalAvailable(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Skeleton for "Seasons" text */}
        <Skeleton colorMode="dark" width={100} height={20} radius={4} />

        {/* Skeleton for season select button */}
        <View style={{ marginVertical: 10 }}>
          <Skeleton colorMode="dark" width="100%" height={45} radius={5} />
        </View>

        {/* Multiple episode skeletons using array */}
        {Array.from({ length: 10 }).map((_, index) => (
          <View
            key={index}
            style={{ marginBottom: 20, paddingTop: 15, paddingHorizontal: 10 }}
          >
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              {/* Poster skeleton */}
              <Skeleton colorMode="dark" width={120} height={70} radius={5} />

              {/* Episode details skeleton */}
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Skeleton colorMode="dark" width="90%" height={20} radius={4} />
                <View style={{ marginTop: 8 }}>
                  <Skeleton
                    colorMode="dark"
                    width={80}
                    height={14}
                    radius={4}
                  />
                </View>
              </View>
            </View>

            {/* Overview skeleton*/}
            <Skeleton colorMode="dark" width="100%" height={60} radius={4} />

            {/* Divider */}
            <View style={styles.divider} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {show.length !== 0 && (
        <Modal
          transparent={false}
          visible={isModalAvailable}
          animationType="slide"
          onRequestClose={() => setIsModalAvailable(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Select a Season</Text>
            <View style={styles.seasonListContainer}>
              <FlatList
                data={show.seasons.map((season, index) => ({ season, index }))}
                keyExtractor={(item) => item.index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.modalItem}
                    onPress={() => handleSeasonChange(item.index)}
                  >
                    <Text
                      style={styles.modalItemText}
                    >{`Season ${item.season.season_number}`}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.modalCloseButton}
              onPress={() => setIsModalAvailable(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <Text style={styles.seasonsText}>Seasons</Text>

      {show.length !== 0 && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.seasonButtonContainer}
          onPress={openSeasonSelector}
        >
          <Text style={styles.seasonButton}>{`Season ${
            selectedSeasonsIndex + 1
          }`}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={show.seasons[selectedSeasonsIndex].episodes}
        keyExtractor={(item) => item._id}
        renderItem={renderEpisodeItem}
        scrollEnabled={false}
      />
    </View>
  );
};

export default ShowSeasonsDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 17,
    height: "auto",
  },
  seasonsText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  seasonButtonContainer: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  seasonButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  modalText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  seasonListContainer: {
    width: "90%",
  },
  modalItem: {
    padding: 10,
    backgroundColor: "grey",
    borderRadius: 5,
    marginVertical: 5,
  },
  modalItemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#daa520",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: "90%",
  },
  modalCloseButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginTop: 15,
    backgroundColor: "#333",
    marginRight: 60,
  },
});
