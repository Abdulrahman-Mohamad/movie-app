import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const USER_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || 'users';
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID || 'saved_movies';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)
const account = new Account(client)
const avatars = new Avatars(client)

export const createUser = async (email: string, password: string, username: string, phone: string, country: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: String(avatarUrl),
        phone,
        country
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    // Check if a session already exists
    try {
      const session = await account.getSession('current');
      if (session) return session;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // No active session, proceed to create one
    }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
      queries: [Query.equal('searchTerm', query)],
    });

    // chech if a record of that search hase already been stored
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      // if a document is found increment the searchCount field
      await database.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        documentId: existingMovie.$id,
        data: { count: (existingMovie.count || 0) + 1 },
      });
      // if no document is found
    } else {
      // create a new document in Appwrite database -> 1
      await database.createDocument({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        documentId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id,
          count: 1,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }

}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
      queries: [
        Query.limit(5),
        Query.orderDesc('count'),
      ],
    });

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined

  }
}

export const saveMovie = async (userId: string, movie: MovieDetails) => {
  try {
    const savedMovie = await database.createDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      }
    );
    return savedMovie;
  } catch (error) {
    console.log("Error saving movie:", error);
    throw new Error(error as string);
  }
}

export const deleteSavedMovie = async (documentId: string) => {
  try {
    await database.deleteDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      documentId
    );
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}

export const getSavedMovies = async (userId: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    return result.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const checkIfSaved = async (userId: string, movieId: number) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.equal('movie_id', movieId)
      ]
    );

    if (result.documents.length > 0) {
      return result.documents[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}