import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, FlatList, Image, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const CATEGORIES = ['Trending', 'Movie', 'TV', 'TV Channel', 'Cricket', 'Anime'];

export default function HomeScreen() {
  // 1. Set up 'State' to hold the cloud data
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch real TV/Movie data from a public API when the app loads
  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data); // Store the massive list of shows in memory
        setLoading(false); // Turn off the loading spinner
      })
      .catch((error) => {
        console.error("Failed to fetch movies:", error);
        setLoading(false);
      });
  }, []);

  // 3. UI layout for a single poster card
  const renderMovie = ({ item }: { item: any }) => (
    <View style={styles.movieCard}>
      <Image source={{ uri: item.image?.medium }} style={styles.poster} />
      <ThemedText type="defaultSemiBold" style={styles.movieTitle} numberOfLines={1}>
        {item.name}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Top Search Bar (Added paddingRight to avoid Expo gear) */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.logo}>▶️</ThemedText>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor="#888"
            />
            <ThemedText type="defaultSemiBold" style={styles.searchBtn}>Search</ThemedText>
          </View>

          {/* Horizontal Category Menu */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity key={index} style={styles.categoryBadge}>
                <ThemedText style={index === 0 ? styles.activeCategory : styles.inactiveCategory}>
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Conditional Rendering: Show spinner while downloading, show lists when ready */}
          {loading ? (
            <ActivityIndicator size="large" color="#00D1FF" style={{ marginTop: 50 }} />
          ) : (
            <>
              {/* Row 1: Shows 1 to 10 */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText type="subtitle">Trending Now</ThemedText>
                  <ThemedText style={styles.seeAll}>All &gt;</ThemedText>
                </View>
                <FlatList
                  horizontal
                  data={movies.slice(0, 10)}
                  renderItem={renderMovie}
                  keyExtractor={item => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
              </View>

              {/* Row 2: Shows 11 to 20 */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText type="subtitle">Highly Rated</ThemedText>
                  <ThemedText style={styles.seeAll}>All &gt;</ThemedText>
                </View>
                <FlatList
                  horizontal
                  data={movies.slice(10, 20)}
                  renderItem={renderMovie}
                  keyExtractor={item => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
            </>
          )}

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingRight: 50, gap: 12 },
  logo: { fontSize: 24, color: '#00D1FF' },
  searchBar: { flex: 1, backgroundColor: '#2A2A2A', borderRadius: 8, padding: 10, color: '#fff' },
  searchBtn: { color: '#00D1FF' },
  categoryScroll: { paddingHorizontal: 16, marginBottom: 20 },
  categoryBadge: { paddingRight: 20 },
  activeCategory: { fontWeight: 'bold', color: '#fff', fontSize: 16 },
  inactiveCategory: { color: '#888', fontSize: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  seeAll: { color: '#888', fontSize: 12 },
  listContainer: { paddingHorizontal: 16, gap: 12 },
  movieCard: { width: 120 },
  poster: { width: 120, height: 180, borderRadius: 8, marginBottom: 8, backgroundColor: '#333' },
  movieTitle: { fontSize: 12 },
});
