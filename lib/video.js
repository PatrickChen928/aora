import { Query } from 'react-native-appwrite'
import { appwriteConfig, database, storage, ID } from "./appwrite"

export const getAllPosts = async () => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')],
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

export const searchPosts = async (query) => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search('title', query)],
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserPosts = async (userId) => {
  if (!userId) return []
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')],
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  if (!fileId) return

  let fileUrl
  try {
    if (type === 'image') {
      fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)
    } else if (type === 'video') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw new Error('Failed to get file preview')

    return fileUrl
  } catch (e) {
    throw new Error(e)
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return

  const asset = { type: mimeType, name: file.fileName, size: file.fileSize, uri: file.uri }
  try {
    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset,
    )

    const fileUrl = await getFilePreview(response.$id, type)
    return fileUrl
  } catch (e) {
    throw new Error(e)
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: form.userId,
      }
    )

    return newPost
  } catch (e) {
    throw new Error(e)
  }
}