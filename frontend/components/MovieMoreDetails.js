import { StyleSheet, Text, View } from "react-native";

export default function MovieMoreDetails({
  budget,
  productionCompanies,
  revenue,
  watchProviders,
  formatToUST,
}) {
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
    gap: 4,
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
});
