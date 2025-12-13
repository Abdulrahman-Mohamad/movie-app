import MovieCard from '@/components/MovieCard';
import { images } from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getSavedMovies } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

const Saved = () => {
    const { user } = useGlobalContext();

    const {
        data: savedMovies,
        loading,
        refetch,
    } = useFetch(() => getSavedMovies(user?.accountId || ''));

    useFocusEffect(
        useCallback(() => {
            if (user) {
                refetch();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [user])
    );

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

            <FlatList
                data={savedMovies}
                renderItem={({ item }) => (
                    <MovieCard
                        id={item.movie_id}
                        title={item.title}
                        poster_path={item.poster_path}
                        vote_average={item.vote_average}
                        release_date={item.release_date}
                        adult={false}
                        original_language='en'
                        backdrop_path=''
                        genre_ids={[]}
                        original_title=''
                        overview=''
                        popularity={0}
                        video={false}
                        vote_count={0}
                    />
                )}
                keyExtractor={(item) => item.$id}
                className='px-5'
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{
                    paddingBottom: 100
                }}
                ListHeaderComponent={
                    <View className='my-5 mt-20'>
                        <Text className='text-2xl text-white font-bold'>Saved Movies</Text>
                    </View>
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className='mt-10 flex-1 justify-center items-center'>
                            <Text className='text-gray-100 text-lg'>No saved movies yet</Text>
                        </View>
                    ) : null
                }
            />

            {loading && (
                <View className='absolute w-full h-full flex justify-center items-center bg-primary/50'>
                    <ActivityIndicator size='large' color='#AB8BFF' />
                </View>
            )}
        </View>
    )
}

export default Saved