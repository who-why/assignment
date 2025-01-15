import React from 'react';
import { StyleSheet, View, ScrollView, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Todo from '@/todos/todo';
import Nav from '@/todos/nav';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Nav />
      <ScrollView contentContainerStyle={styles.content}>
        <Todo />
      </ScrollView>
    </View>
  );
}

// styling 
interface Styles {
  container: StyleProp<ViewStyle>;
  navbar: StyleProp<ViewStyle>;
  navItem: StyleProp<TextStyle>;
  content: StyleProp<ViewStyle>;
  userProfile: StyleProp<ViewStyle>;
  profileImage: StyleProp<ViewStyle>;
  userName: StyleProp<TextStyle>;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  content: {
    padding: 10, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
