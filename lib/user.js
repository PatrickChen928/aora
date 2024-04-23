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