import React from 'react';
import { StyleSheet, Text, View, SectionList, ImageBackground, SafeAreaView, Platform, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';

const LESSON_TIMES = {
  '08:00': 1, '09:40': 2, '11:30': 3, '13:10': 4, '14:50': 5,
};

const getLessonNumber = (dateString) => { 
  const time = dateString.split(' ')[1];
  return LESSON_TIMES[time] || '?';
};

const scheduleData = [
  { "name": "АтаРБП [Лк]", "place": "ауд. 1207", "teacher": "Чіков І.А.", "type": "lection", "start": "2025-09-15 11:30", "end": "2025-09-15 12:50" },
  { "name": "АтаМОСС [Лк]", "place": "ауд. 1408", "teacher": "Бойко О.Р.", "type": "lection", "start": "2025-09-15 13:10", "end": "2025-09-15 14:30" },
  { "name": "МА [Пз]", "place": "ауд. Храм", "teacher": "Ревкова А.В.", "type": "practice", "start": "2025-09-16 08:00", "end": "2025-09-16 09:20" },
  { "name": "МОНДзОІВ [Лк]", "place": "ауд. №1 -1208", "teacher": "Красиленко В.Г.", "type": "lection", "start": "2025-09-16 11:30", "end": "2025-09-16 12:50" },
  { "name": "АтаРБП [Лк]", "place": "ауд. 1304", "teacher": "Чіков І.А.", "type": "lection", "start": "2025-09-16 13:10", "end": "2025-09-16 14:30" },
];

const groupDataByDate = (data) => {
  const groups = data.reduce((acc, item) => {
    const date = item.start.split(' ')[0];
    if (!acc[date]) { acc[date] = []; }
    acc[date].push(item);
    return acc;
  }, {});
  return Object.keys(groups).map(date => ({ title: date, data: groups[date] }));
};

const groupedData = groupDataByDate(scheduleData);

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
};

// ОНОВЛЕНО: Компонент LessonCard
const LessonCard = ({ item }) => {
  const isLection = item.type === 'lection';
  const tagColor = isLection ? '#4A90E2' : '#50E3C2';
  const lessonNumber = getLessonNumber(item.start);

  // НОВИЙ РЯДОК: Видаляємо [Лк] та [Пз] з назви
  const cleanedName = item.name.replace(/\[.*?\]/g, '').trim();

  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={50} tint="light" style={styles.blurView}>
        <View style={styles.lessonNumberCircle}>
            <Text style={styles.lessonNumberText}>{lessonNumber}</Text>
        </View>
        <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(item.start)}</Text>
            <Text style={styles.timeText}>{formatTime(item.end)}</Text>
        </View>
        <View style={styles.detailsContainer}>
            {/* ВИКОРИСТОВУЄМО ОЧИЩЕНУ НАЗВУ */}
            <Text style={styles.lessonName}>{cleanedName}</Text>
            <Text style={styles.detailsText}>{item.teacher}</Text>
            <Text style={styles.detailsText}>{item.place}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: tagColor }]}>
            <Text style={styles.tagText}>{isLection ? 'ЛК' : 'ПЗ'}</Text>
        </View>
      </BlurView>
    </View>
  );
};

// ... (решта коду залишається без змін)
const SectionHeader = ({ title }) => {
    const date = new Date(title);
    const formattedDate = date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dayOfWeek = date.toLocaleDateString('uk-UA', { weekday: 'long' });
    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.dayOfWeekText}>{capitalizedDayOfWeek}</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
    );
};

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>UniFlow</Text>
        <SectionList
          sections={groupedData}
          renderItem={({ item }) => <LessonCard item={item} />}
          renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginVertical: 20, textShadowColor: 'rgba(0, 0, 0, 0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  sectionHeader: { backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingHorizontal: 15, paddingVertical: 8, marginHorizontal: 15, marginTop: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayOfWeekText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  dateText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 },
  cardContainer: { marginHorizontal: 15, marginVertical: 8, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  blurView: { padding: 15, flexDirection: 'row', alignItems: 'center' },
  lessonNumberCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.25)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  lessonNumberText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  timeContainer: { alignItems: 'center', marginRight: 15, paddingRight: 15, borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.3)' },
  timeText: { color: 'white', fontSize: 16, fontWeight: '500' },
  detailsContainer: { flex: 1 },
  lessonName: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  detailsText: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  tagText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});