import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { ResizeMode, Video } from 'expo-av'
import FormField from '../../components/FormField'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { createVideo } from '../../lib/video'
import { useGlobalContext } from '../../context/GlobalProvider'

const Create = () => {

  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  })

  const openPicker = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // const result = await DocumentPicker.getDocumentAsync({
    //   type: type === 'image' ? ['image/png', 'image/jpg', 'image/jpeg'] : ['video/mp4', 'video/gif'],
    // })

    if (!result.canceled) {
      if (type === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] })
      } else {
        setForm({ ...form, video: result.assets[0] })
      }
    }
  }

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert('Please fill in all the fields')
      return
    }

    setUploading(true)

    try {
      await createVideo({
        ...form,
        userId: user.$id
      })
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      })
      Alert.alert('Success', 'Post uploaded successfully')
      router.push('/home')
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setUploading(false)
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>
        <FormField
          title="Video Title"
          placeholder="Give your video a catch title..."
          value={form.title}
          handleChangeText={(title) => setForm({ ...form, title })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">Upload Video</Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {
              form.video ? (
                <Video source={{ uri: form.video.uri }} className="h-64 w-full rounded-2xl" resizeMode={ResizeMode.COVER} isLooping />
              ) : (
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-secondary-100 border-dashed justify-center items-center">
                    <Image source={icons.upload} resizeMode="contain" className="w-1/2 h-1/2" />
                  </View>
                </View>
              )
            }
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {
              form.thumbnail ? (
                <Image source={{ uri: form.thumbnail.uri }} className="h-64 w-full rounded-2xl" resizeMode="cover" />
              ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image source={icons.upload} resizeMode="contain" className="w-5 h-5" />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )
            }
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          placeholder="The prompt your used to create this video"
          value={form.prompt}
          handleChangeText={(prompt) => setForm({ ...form, prompt })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create