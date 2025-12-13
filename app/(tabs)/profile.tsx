import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/services/appwrite";
import { router } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();

    const logout = async () => {
        try {
            await signOut();
            setUser(null);
            setIsLogged(false);
            router.replace("/sign-in");
        } catch (error) {
            Alert.alert("Error", "Failed to sign out");
            console.log(error);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="w-full flex justify-center items-center mt-6 px-4">
                <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                    <Image
                        source={{ uri: user?.avatar }}
                        className="w-[90%] h-[90%] rounded-lg"
                        resizeMode="cover"
                    />
                </View>

                <View className="mt-5">
                    <Text className="text-white text-center font-psemibold text-lg">
                        {user?.username}
                    </Text>
                    <Text className="text-gray-100 text-center font-pregular text-sm">
                        {user?.email}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={logout}
                    className="flex-row items-center gap-3 mt-10 bg-black-100 px-8 py-4 rounded-xl border border-black-200 w-full"
                >
                    <Image
                        source={icons.arrow} // Using arrow as a placeholder for logout, or just text
                        className="w-6 h-6 rotate-180" // Rotate to point 'out'
                        resizeMode="contain"
                        tintColor="#FF9C01"
                    />
                    <Text className="text-white font-psemibold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;