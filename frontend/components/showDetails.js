import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../utils/formatDate";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ShowDetails({
  show,
  handlePlayFirstEpisode,
  playOrResume,
}) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if overview is long enough to need divider adjustment
  const isLongOverview = show?.overview?.length > 350;
  const shouldMoveDivider = isExpanded && isLongOverview;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View>
        <View style={styles.container}>
          {/* Backdrop skeleton */}
          <Skeleton
            width={responsiveWidth(100)}
            height={responsiveHeight(20)}
            radius={0}
            colorMode="dark"
          />

          {/* Back button skeleton */}
          <View style={styles.backButtonSkeleton}>
            <Skeleton width={40} height={40} radius={20} colorMode="dark" />
          </View>

          {/* Content skeleton */}
          <View style={styles.skeletonContent}>
            {/* Poster and Play button skeleton */}
            <View style={{ gap: 10 }}>
              <Skeleton
                width={responsiveWidth(30)}
                height={responsiveHeight(20)}
                radius={5}
                colorMode="dark"
              />
              {/* Play button skeleton */}
              <Skeleton
                width={responsiveWidth(30)}
                height={responsiveHeight(4)}
                radius={responsiveWidth(1)}
                colorMode="dark"
              />
            </View>

            {/* Text skeletons */}
            <View style={styles.skeletonTextContainer}>
              <Skeleton
                width={responsiveWidth(40)}
                height={12}
                colorMode="dark"
              />
              <Skeleton
                width={responsiveWidth(20)}
                height={10}
                colorMode="dark"
                style={{ marginTop: 8 }}
              />
              <Skeleton
                width={responsiveWidth(35)}
                height={10}
                colorMode="dark"
                style={{ marginTop: 6 }}
              />
              <Skeleton
                width={responsiveWidth(25)}
                height={10}
                colorMode="dark"
                style={{ marginTop: 6 }}
              />
              <Skeleton
                width={responsiveWidth(15)}
                height={14}
                colorMode="dark"
                style={{ marginTop: 8 }}
              />
              <Skeleton
                width={responsiveWidth(50)}
                height={80}
                colorMode="dark"
                style={{ marginTop: 6 }}
              />
            </View>
          </View>
        </View>

        <View style={styles.firstDivider} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: show.backdropPath }}
          style={styles.dropImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,1)"]}
            style={styles.linearGradient}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <View style={styles.showDetailsContainer}>
              <View style={styles.posterContainer}>
                <Image
                  source={{ uri: show.posterPath }}
                  style={styles.posterImage}
                />
                <TouchableOpacity
                  onPress={() => handlePlayFirstEpisode(show._id)}
                  activeOpacity={0.8}
                  style={styles.playButton}
                >
                  <Text style={styles.playText}>{playOrResume}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.showName}>{show.name}</Text>

                <View style={styles.ratingsContainer}>
                  <EntypoIcon name="star" size={12} color="#daa520" />
                  <Text style={styles.showRatings}>
                    {Number(show.ratings).toFixed(1)}
                  </Text>
                </View>

                <Text style={styles.showGenres}>{show.genres.join(", ")}</Text>
                <Text style={styles.showReleaseDate}>
                  {formatDate(show.releaseDate)}
                </Text>

                <View style={styles.plotContainer}>
                  <Text style={styles.PlotText}>Plot</Text>
                  {show.overview.length > 190 && (
                    <TouchableOpacity
                      onPress={() => setIsExpanded(!isExpanded)}
                    >
                      <EntypoIcon
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={15}
                        color="grey"
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <Text
                  style={styles.showOverview}
                  numberOfLines={isExpanded ? undefined : 4}
                  ellipsizeMode="tail"
                >
                  {show.overview}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View
        style={[
          styles.firstDivider,
          shouldMoveDivider && styles.firstDividerExpanded,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(20),
    width: "100%",
  },
  dropImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  linearGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  backButtonSkeleton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 90,
  },
  showDetailsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  skeletonContent: {
    position: "absolute",
    top: 90,
    left: 15,
    right: 15,
    flexDirection: "row",
    gap: 15,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 5,
    gap: 6,
  },
  posterContainer: {
    gap: 10,
  },
  posterImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    borderRadius: 5,
  },
  playButton: {
    backgroundColor: "#daa520",
    padding: 8,
    width: responsiveWidth(30),
    borderRadius: responsiveWidth(1),
  },
  playText: {
    color: "black",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 5,
  },
  showName: {
    color: "#fafafa",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  showRatings: {
    color: "grey",
    fontSize: 12,
    fontWeight: "bold",
  },
  showGenres: {
    color: "grey",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
  },
  showReleaseDate: {
    color: "grey",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },
  plotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  PlotText: {
    color: "grey",
    fontSize: 15,
    fontWeight: "bold",
  },
  showOverview: {
    color: "grey",
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 13,
  },
  firstDivider: {
    height: 0.5,
    backgroundColor: "#333",
    marginTop: 160,
    marginHorizontal: 50,
  },
  firstDividerExpanded: {
    marginTop: 190,
  },
});
