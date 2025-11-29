import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Skeleton } from "moti/skeleton";
import { responsiveWidth } from "react-native-responsive-dimensions";

export default function MovieMoreDetails({
  budget,
  productionCompanies,
  revenue,
  watchProviders,
  formatToUST,
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {/* Title skeleton */}
        <Skeleton
          width={responsiveWidth(30)}
          height={20}
          radius={4}
          colorMode="dark"
        />

        <View style={styles.skeletonSubContainer}>
          <Skeleton width={responsiveWidth(50)} height={12} colorMode="dark" />
          <Skeleton
            width={responsiveWidth(45)}
            height={12}
            colorMode="dark"
            style={styles.skeletonLine}
          />
          <Skeleton
            width={responsiveWidth(70)}
            height={12}
            colorMode="dark"
            style={styles.skeletonLine}
          />
          <Skeleton
            width={responsiveWidth(60)}
            height={12}
            colorMode="dark"
            style={styles.skeletonLine}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.movieMoreDetailsText}>More Details</Text>

      <View style={styles.subContainer}>
        <Text style={styles.movieDetailsText}>
          <Text style={styles.mainText}>Budget:</Text> {formatToUST(budget)}
        </Text>

        <Text style={styles.movieDetailsText}>
          <Text style={styles.mainText}>Revenue:</Text> {formatToUST(revenue)}
        </Text>

        <Text style={styles.movieDetailsText}>
          <Text style={styles.mainText}>Productions:</Text>{" "}
          {productionCompanies.join(", ").replace(/,/g, ", ")}
        </Text>

        <Text style={styles.movieDetailsText}>
          <Text style={styles.mainText}>Watch Providers:</Text> {watchProviders}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    padding: 17,
  },
  movieMoreDetailsText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
  },
  subContainer: {
    marginTop: 8,
    marginLeft: 8,
    gap: 10,
  },
  mainText: {
    color: "grey",
    fontWeight: "900",
  },
  movieDetailsText: {
    color: "grey",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 20,
  },
  skeletonContainer: {
    flex: 1,
    marginTop: 5,
    padding: 17,
  },
  skeletonSubContainer: {
    marginTop: 15,
    marginLeft: 8,
    gap: 15,
  },
  skeletonLine: {
    marginTop: 6,
  },
});
