import { icons } from '@/constants/icons';
import { useGlobalContext } from '@/context/GlobalProvider';
import { fetchMovieDetails } from '@/services/api';
import { checkIfSaved, deleteSavedMovie, saveMovie } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value?: string | number | null
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className='flex-col justify-center mt-5 '>
    <Text className='text-light-200 text-sm'>{label}</Text>
    <Text className='text-light-100 font-bold text-sm mt-2'>{value || 'N/A'}</Text>
  </View>
)

const Details = () => {
  const { id } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: movie } = useFetch(() => fetchMovieDetails(id as string));

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user && movie) {
        const savedMovie = await checkIfSaved(user.accountId, movie.id);
        if (savedMovie) {
          setIsSaved(true);
          setSavedDocId(savedMovie.$id);
        } else {
          setIsSaved(false);
          setSavedDocId(null);
        }
      }
    };

    checkSavedStatus();
  }, [user, movie]);

  const toggleSave = async () => {


    if (!user) {
      Alert.alert("Error", "You must be logged in to save movies.");
      return;
    }
    if (!movie || isSaving) return;

    setIsSaving(true);
    try {
      if (isSaved && savedDocId) {
        await deleteSavedMovie(savedDocId);
        setIsSaved(false);
        setSavedDocId(null);
      } else {
        const result = await saveMovie(user.accountId, movie);
        setIsSaved(true);
        setSavedDocId(result.$id);
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message || "Failed to save movie");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
            className='w-full h-[550px]'
            resizeMode='stretch'
          />
        </View>
        <View className='flex-col justify-center mt-5 px-5 '>
          <View className='flex-row justify-between items-center'>
            <Text className='text-white text-xl font-bold flex-1'>{movie?.title}</Text>
            <TouchableOpacity onPress={toggleSave} disabled={isSaving}>
              <Image
                source={icons.save}
                className='size-6'
                tintColor={isSaved ? '#AB8BFF' : '#fff'}
              />
            </TouchableOpacity>
          </View>

          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
          </View>
          <View className='w-32 flex-row items-center justify-center bg-dark-100  py-1 rounded-md gap-x-1 mt-2'>
            <Image source={icons.star} className='size-4' />
            <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
            <Text className='text-light-200 text-sm'>({movie?.vote_count} votes)</Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'} />
          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo label="Budget" value={movie?.budget ? `$${(movie.budget / 1_000_000).toFixed(1)} million` : 'N/A'} />
            <MovieInfo label="Revenue" value={movie?.revenue ? `$${(Math.round(movie.revenue) / 1_000_000).toFixed(1)} million` : 'N/A'} />
          </View>
          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((c) => c.name).join(' - ') || 'N/A'} />
        </View>
      </ScrollView>
      <TouchableOpacity
        className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
        onPress={() => router.back()}
      >
        <Image source={icons.arrow} className='size-5 me-1 mt-0.5 rotate-180' tintColor='#fff' />
        <Text className='text-white font-semibold'>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Details