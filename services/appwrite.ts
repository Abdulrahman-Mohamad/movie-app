import { Client, Databases, ID, Query } from 'react-native-appwrite';
// track the searches made by a user
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)

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