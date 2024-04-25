import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Suspense, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/video'
import { useAppwrite } from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch, loading } = useAppwrite(() => searchPosts(query))

  useEffect(() => {
    refetch()
  }, [query])

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="h-full flex items-center ">
          <ActivityIndicator className="mt-[50vh]" size="large" color="#FF9C28" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={item => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                initialQuery={query}
                placeholder="Search for a video topic"
              />
            </View>
          </View>
        )
        }
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this search query" />
        )}
      />
    </SafeAreaView >
  )
}

export default Search