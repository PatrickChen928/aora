import { Query } from 'react-native-appwrite'
import { appwriteConfig, database } from "./appwrite"

export const getAllPosts = async () => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))],
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}