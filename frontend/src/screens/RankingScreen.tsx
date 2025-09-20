import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface RankItem {
  id: string;
  name: string;
  score: number;
  position: number;
}

const MOCK_RANKING: RankItem[] = [
  { id: '1', name: 'Você', score: 1250, position: 1 },
  { id: '2', name: 'Motorista A', score: 1200, position: 2 },
  { id: '3', name: 'Motorista B', score: 1150, position: 3 },
  { id: '4', name: 'Motorista C', score: 1100, position: 4 },
  { id: '5', name: 'Motorista D', score: 1050, position: 5 },
];

const RankItemComponent: React.FC<{ item: RankItem }> = ({ item }) => (
  <View style={styles.rankItem}>
    <Text style={styles.rankPosition}>{item.position}º</Text>
    <Text style={styles.rankName}>{item.name}</Text>
    <Text style={styles.rankScore}>{item.score} pts</Text>
  </View>
);

const RankingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking de Motoristas</Text>
      <FlatList
        data={MOCK_RANKING}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RankItemComponent item={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  rankItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankPosition: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 15,
    color: '#007AFF',
  },
  rankName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  rankScore: {
    fontSize: 16,
    color: '#777',
  },
});

export default RankingScreen;


