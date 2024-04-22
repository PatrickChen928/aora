import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-pblack">Aora!!</Text>
      <StatusBar style="auto" />
      <Link href="/home" className="text-blue-500">Home</Link>
    </View>
  )
}