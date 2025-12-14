import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getSavedMovies, signOut } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();

    const { data: savedMovies } = useFetch(() => getSavedMovies(user?.accountId || ''));

    const logout = async () => {
        try {
            await signOut();
            setUser(null);
            setIsLogged(false);
            router.replace("/sign-in");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="w-full flex justify-center items-center mt-6 px-4">
                <View className="w-24 h-24 border-2 border-secondary rounded-full justify-center items-center overflow-hidden">
                    <Image
                        source={{ uri: user?.avatar }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>

                <View className="mt-5 items-center">
                    <Text className="text-white font-psemibold text-2xl">
                        {user?.username}
                    </Text>
                    <Text className="text-gray-100 font-pregular text-base mt-1">
                        {user?.email}
                    </Text>
                </View>

                <View className="mt-10 flex-row justify-center items-center gap-10 w-full">
                    <View className="items-center">
                        <Text className="text-white font-psemibold text-xl">
                            {savedMovies?.length || 0}
                        </Text>
                        <Text className="text-gray-100 font-pregular text-sm">
                            Saved Movies
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={logout}
                    className="flex-row items-center justify-center gap-3 mt-10 bg-secondary px-8 py-4 rounded-xl w-full"
                >
                    <Image
                        source={icons.arrow}
                        className="w-6 h-6"
                        resizeMode="contain"
                    />
                    <Text className="text-primary font-psemibold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;