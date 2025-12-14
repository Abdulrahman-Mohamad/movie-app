import { Link, Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function App() {
    const { loading, isLogged } = useGlobalContext();

    if (!loading && isLogged) return <Redirect href="/(tabs)" />;

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView
                contentContainerStyle={{
                    height: "100%",
                }}
            >
                <View className="w-full flex justify-center items-center h-full px-4">
                    <Image
                        source={icons.logo}
                        className="w-[130px] h-[84px]"
                        resizeMode="contain"
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-white font-bold text-center">
                            Discover Endless{"\n"}
                            Movies with <Text className="text-secondary-200">Movira</Text>
                        </Text>
                    </View>

                    <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
                        Where Creativity Meets Innovation: Embark on a Journey of Limitless
                        Exploration with Movira
                    </Text>

                    <CustomButton
                        title="Continue with Email"
                        handlePress={() => router.push("/sign-in")}
                        containerStyles="w-full mt-7"
                    />

                    <Text className="mt-20">This app Developed by <Link className="text-blue-700 font-semibold" href={"https://portfolio-zeta-three.vercel.app/"} target="_blank">Abdulrahman Mohamed</Link></Text>
                </View>
            </ScrollView>

            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    );
}
