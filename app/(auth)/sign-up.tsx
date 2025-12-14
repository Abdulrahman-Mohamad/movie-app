import { Link, router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CountryPicker from "@/components/CountryPicker";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { countries } from "@/constants/countries";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createUser } from "@/services/appwrite";

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();

    const [isSubmitting, setSubmitting] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryCode, setCountryCode] = useState("");
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        country: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        country: "",
    });
    const [authError, setAuthError] = useState("");

    const validateField = (field: string, value: string) => {
        let errorMessage = "";
        if (field === "username") {
            if (!value) {
                errorMessage = "Username is required";
            }
        } else if (field === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = "Email is required";
            } else if (!emailRegex.test(value)) {
                errorMessage = "Invalid email address";
            }
        } else if (field === "password") {
            if (!value) {
                errorMessage = "Password is required";
            } else if (value.length < 8) {
                errorMessage = "Password must be at least 8 characters";
            }
        } else if (field === "phone") {
            if (!value) {
                errorMessage = "Phone number is required";
            }
        } else if (field === "country") {
            if (!value) {
                errorMessage = "Country is required";
            }
        }
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    const submit = async () => {
        setAuthError("");
        if (form.username === "" || form.email === "" || form.password === "" || form.phone === "" || form.country === "") {
            setErrors({
                username: form.username ? "" : "Username is required",
                email: form.email ? "" : "Email is required",
                password: form.password ? "" : "Password is required",
                phone: form.phone ? "" : "Phone number is required",
                country: form.country ? "" : "Country is required",
            });
            return;
        }

        setSubmitting(true);
        try {
            const fullPhone = `${countryCode}${form.phone}`;
            const result = await createUser(form.email, form.password, form.username, fullPhone, form.country);
            setUser(result as unknown as User);
            setIsLogged(true);

            router.replace("/(tabs)");
        } catch (error) {
            console.log((error as Error).message);
            const errorMessage = (error as Error).message;
            if (errorMessage.includes("already exists")) {
                setAuthError("A user with this email or username already exists.");
            } else if (errorMessage.includes("Network request failed")) {
                setAuthError("Please check your internet connection.");
            } else {
                setAuthError("Failed to create account. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCountrySelect = (item: typeof countries[0]) => {
        setForm({ ...form, country: item.name });
        setCountryCode(`+${item.phone}`);
        if (errors.country) validateField("country", item.name);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex justify-center h-full px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <Image
                        source={icons.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[34px]"
                    />

                    <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
                        Sign Up to Movie App
                    </Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => {
                            setForm({ ...form, username: e });
                            if (errors.username) validateField("username", e);
                        }}
                        otherStyles="mt-10"
                        onBlur={() => validateField("username", form.username)}
                        error={errors.username}
                    />

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => {
                            setForm({ ...form, email: e });
                            if (errors.email) validateField("email", e);
                        }}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        onBlur={() => validateField("email", form.email)}
                        error={errors.email}
                    />

                    <View className="space-y-2 mt-7">
                        <Text className="text-base text-gray-100 font-pmedium">Country</Text>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker(true)}
                            className={`w-full h-16 px-4 bg-[#1C1C1E] rounded-2xl border-2 flex flex-row items-center ${errors.country ? 'border-red-500' : 'border-black-200 focus:border-secondary'}`}
                        >
                            <Text className={`flex-1 font-psemibold text-base ${form.country ? 'text-white' : 'text-gray-400'}`}>
                                {form.country || "Select your country"}
                            </Text>
                        </TouchableOpacity>
                        {errors.country && <Text className="text-red-500 text-sm font-pmedium">{errors.country}</Text>}
                    </View>

                    <FormField
                        title="Phone Number"
                        value={form.phone}
                        handleChangeText={(e) => {
                            setForm({ ...form, phone: e });
                            if (errors.phone) validateField("phone", e);
                        }}
                        otherStyles="mt-7"
                        keyboardType="phone-pad"
                        onBlur={() => validateField("phone", form.phone)}
                        error={errors.phone}
                        prefix={countryCode}
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => {
                            setForm({ ...form, password: e });
                            if (errors.password) validateField("password", e);
                        }}
                        otherStyles="mt-7"
                        onBlur={() => validateField("password", form.password)}
                        error={errors.password}
                    />

                    {authError ? (
                        <Text className="text-red-500 text-center mt-4 font-pmedium">{authError}</Text>
                    ) : null}

                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Have an account already?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Login
                        </Link>
                    </View>
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

export default SignUp;
