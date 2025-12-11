import { icons } from '@/constants/icons'
import { Link } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
const MovieCard = ({ id, poster_path, title, vote_average, release_date, original_language ,adult}: Movie) => {


  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className='w-[30%] relative'>
        {adult && (
          <View className="absolute top-2 right-2 bg-red-600 px-1 py-0.5 rounded z-10">
            <Text className="text-[10px] text-white font-bold">+18</Text>
          </View>
        )}
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : `https://placehold.co/600x400/1a1a1a/ffffff.png`
          }}
          className='w-full h-52 rounded-lg'
          resizeMode='cover'
        />
        <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>
        <View className='flex-row items-center gap-x-1'>
          <Image source={icons.star} className='size-4' />
          <Text className='text-xs text-white font-bold uppercase'>{Math.round(vote_average / 2)}</Text>
        </View>
        <View className='flex-row items-center justify-between'>
          <Text className='text-sm text-light-300 mt-1'>
            {release_date?.split('-')[0]}
          </Text>
          <Text className='text-sm text-light-300 uppercase text-right'>
            {original_language}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}
export default MovieCard