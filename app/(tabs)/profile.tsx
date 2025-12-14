import CountryPicker from "@/components/CountryPicker";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { countries } from "@/constants/countries";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { deleteFile, getSavedMovies, signOut, updateUser, uploadFile } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();
    const { data: savedMovies } = useFetch(() => getSavedMovies(user?.accountId || ''));

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryCode, setCountryCode] = useState("");

    const [form, setForm] = useState({
        username: "",
        phone: "",
        country: "",
        bio: "",
        avatar: null as any,
    });

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || "",
                phone: user.phone?.replace(/^\+\d+/, "") || "",
                country: user.country || "",
                bio: user.bio || "",
                avatar: user.avatar || null,
            });

            if (user.phone && user.country) {
                const countryData = countries.find(c => c.name === user.country);
                if (countryData) {
                    setCountryCode(`+${countryData.phone}`);
                    const phoneWithoutCode = user.phone.replace(`+${countryData.phone}`, "");
                    setForm(prev => ({ ...prev, phone: phoneWithoutCode }));
                }
            }
        }
    }, [user, isEditing]);

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

    const openPicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({

            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({ ...form, avatar: result.assets[0] });
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            let avatarUrl = user.avatar;

            if (form.avatar && typeof form.avatar === 'object' && form.avatar.uri !== user.avatar) {
                const uploadedUrl = await uploadFile(form.avatar, 'image');
                if (typeof uploadedUrl === 'string') {
                    avatarUrl = uploadedUrl;
                } else if (uploadedUrl) {
                    // Convert to string using toString()
                    avatarUrl = (uploadedUrl as any).toString();
                }
                // Delete old avatar if it exists and is different
                if (user.avatar && user.avatar.includes('cloud.appwrite.io') && avatarUrl !== user.avatar) {
                    try {
                        const fileId = user.avatar.split('/files/')[1]?.split('/')[0];
                        if (fileId) {
                            await deleteFile(fileId);
                        }
                    } catch (error) {
                        console.log("Error deleting old avatar:", error);
                    }
                }
            }

            const fullPhone = `${countryCode}${form.phone}`;
            const updatedUser = await updateUser(
                user.$id,
                form.username,
                fullPhone,
                form.country,
                form.bio,
                avatarUrl
            );

            setUser({
                ...user,
                username: updatedUser.username,
                phone: updatedUser.phone,
                country: updatedUser.country,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
            });
            setForm({
                ...form,
                avatar: updatedUser.avatar,
            });
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully");
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCountrySelect = (item: typeof countries[0]) => {
        setForm({ ...form, country: item.name });
        setCountryCode(`+${item.phone}`);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="w-full flex justify-center items-center mt-6 px-4">
                    <View className="w-24 h-24 border-2 border-secondary rounded-full justify-center items-center overflow-hidden relative">
                        <Image
                            source={{ uri: form.avatar?.uri || form.avatar || user?.avatar }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {isEditing && (
                            <TouchableOpacity
                                onPress={openPicker}
                                className="absolute w-full h-full bg-black/50 justify-center items-center"
                            >
                                <Image
                                    source={icons.upload}
                                    className="w-8 h-8 tint-white"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {!isEditing ? (
                        <>
                            <View className="mt-5 items-center">
                                <Text className="text-white font-psemibold text-2xl">
                                    {user?.username}
                                </Text>
                                <Text className="text-gray-100 font-pregular text-base mt-1">
                                    {user?.email}
                                </Text>
                                {user?.bio && (
                                    <Text className="text-gray-100 font-pregular text-sm mt-2 text-center px-4">
                                        {user.bio}
                                    </Text>
                                )}
                                <View className="flex-row gap-3 mt-2">
                                    {user?.country && (
                                        <Text className="text-gray-100 font-pregular text-sm">
                                            {user.country}
                                        </Text>
                                    )}
                                    {user?.phone && (
                                        <Text className="text-gray-100 font-pregular text-sm">
                                            {user.phone}
                                        </Text>
                                    )}
                                </View>
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

                            <CustomButton
                                title="Edit Profile"
                                handlePress={() => setIsEditing(true)}
                                containerStyles="w-full mt-10"
                            />

                            <TouchableOpacity
                                onPress={logout}
                                className="flex-row items-center justify-center gap-3 mt-5 bg-[#1C1C1E] px-8 py-4 rounded-xl w-full"
                            >
                                <Image
                                    source={icons.arrow}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                                <Text className="text-white font-psemibold text-lg">Sign Out</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View className="w-full mt-5">
                            <Text className="text-white font-psemibold text-xl mb-5 text-center">Edit Profile</Text>

                            <FormField
                                title="Username"
                                value={form.username}
                                handleChangeText={(e) => setForm({ ...form, username: e })}
                                otherStyles="mt-4"
                            />

                            <View className="space-y-2 mt-4">
                                <Text className="text-base text-gray-100 font-pmedium">Email</Text>
                                <View className="w-full h-16 px-4 bg-[#1C1C1E] rounded-2xl border-2 border-black-200 flex flex-row items-center opacity-50">
                                    <Text className="text-gray-400 font-psemibold text-base flex-1">
                                        {user?.email}
                                    </Text>
                                </View>
                            </View>

                            <View className="space-y-2 mt-4">
                                <Text className="text-base text-gray-100 font-pmedium">Country</Text>
                                <TouchableOpacity
                                    onPress={() => setShowCountryPicker(true)}
                                    className="w-full h-16 px-4 bg-[#1C1C1E] rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center"
                                >
                                    <Text className={`flex-1 font-psemibold text-base ${form.country ? 'text-white' : 'text-gray-400'}`}>
                                        {form.country || "Select your country"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <FormField
                                title="Phone Number"
                                value={form.phone}
                                handleChangeText={(e) => setForm({ ...form, phone: e })}
                                otherStyles="mt-4"
                                keyboardType="phone-pad"
                                prefix={countryCode}
                            />

                            <FormField
                                title="Bio"
                                value={form.bio}
                                handleChangeText={(e) => setForm({ ...form, bio: e })}
                                otherStyles="mt-4"
                                multiline
                                numberOfLines={4}
                            />

                            <View className="flex-row gap-4 mt-10">
                                <CustomButton
                                    title="Cancel"
                                    handlePress={() => setIsEditing(false)}
                                    containerStyles="flex-1 bg-[#1C1C1E]"
                                />
                                <CustomButton
                                    title="Save Changes"
                                    handlePress={handleSave}
                                    containerStyles="flex-1"
                                    isLoading={isSubmitting}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <CountryPicker
                visible={showCountryPicker}
                onClose={() => setShowCountryPicker(false)}
                onSelect={handleCountrySelect}
            />
        </SafeAreaView>
    );
};

export default Profile;