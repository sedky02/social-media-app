import { ERROR, INewUser, SUCCESS } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );
    if (!newAccount)
      return { content: "", message: "Account already exists", status: ERROR };
    const avatarURL = avatars.getInitials();
    const newUser = await createUser({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarURL,
    });

    return {
      content: newUser,
      message: "Account registered successfully.",
      status: SUCCESS,
    };
  } catch (error) {
    console.log(error);
    return { content: error, message: "", status: ERROR };
  }
}
export async function createUser(user: {
  accountId: string;
  name: string;
  email: string;
  username: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user,
    );
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return {
      content: session,
      message: "Session succesfully created!",
      status: SUCCESS,
    };
  } catch (error) {
    console.log({ "Sign In Error": error });
    return {
      content: error,
      message: "there is an error in singInAccount",
      status: ERROR,
    };
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return {
      content: session,
      message: "Session deleted successfully.",
      status: SUCCESS,
    };
  } catch (error) {
    console.log({ "Sign Out Error": error });
    return {
      content: error,
      message: "there is an error in singOutAccount",
      status: ERROR,
    };
  }
}
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId",currentAccount.$id)]
    );
    if(!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
