import { View, Text, FlatList } from 'react-native'

const Trending = ({ posts }) => {
  return (
    <FlatList
      data={posts || []}
      keyExtractor={item => item.$id}
      renderItem={({ item }) => () => (
        <View className="bg-black-100 rounded-2xl p-4 space-y-2">
          <Text className="text-white font-pmedium text-base">{item.title}</Text>
          <Text className="text-gray-100 font-pregular text-sm">{item.description}</Text>
        </View>
      )}
      horizontal
    />
  )
}

export default Trending