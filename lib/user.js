import { Query } from "react-native-appwrite";
import { account, ID, avatars, database, appwriteConfig } from "./appwrite";


export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password)
    return session
  } catch (e) {
    throw new Error(e)
  }
}

export const createUser = async (username, email, password) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username)

    if (!newAccount) throw Error('Failed to create user')

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      })

    return newUser
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

export const getCurrentUser = async () => {
  try {
    const user = await account.get()

    if (!user) throw Error('Failed to get user')

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', user.$id)],
    )

    if (!currentUser) throw Error('Failed to get current user')

    return currentUser.documents[0]
  } catch (e) {
    throw new Error(e)
  }
}