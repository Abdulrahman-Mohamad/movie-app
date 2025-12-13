import { Link, router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getCurrentUser, signIn } from "@/services/appwrite";

const SignIn = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [authError, setAuthError] = useState("");

    const validateField = (field: string, value: string) => {
        let errorMessage = "";
        if (field === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = "Email is required";
            } else if (!emailRegex.test(value)) {
                errorMessage = "Invalid email address";
            }
        } else if (field === "password") {
            if (!value) {
                errorMessage = "Password is required";
            }
        }
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    const submit = async () => {
        setAuthError("");
        if (form.email === "" || form.password === "") {
            setErrors({
                email: form.email ? "" : "Email is required",
                password: form.password ? "" : "Password is required",
            });
            return;
        }

        setSubmitting(true);

        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            if (!result) throw new Error("Failed to get user data. Please check your internet connection or database permissions.");

            setUser(result as unknown as User);
            setIsLogged(true);

            router.replace("/(tabs)");
        } catch (error) {
            console.log((error as Error).message);
            const errorMessage = (error as Error).message;
            if (errorMessage.includes("Invalid credentials")) {
                setAuthError("Incorrect email or password.");
            } else if (errorMessage.includes("Network request failed")) {
                setAuthError("Please check your internet connection.");
            } else {
                setAuthError("Failed to sign in. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
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
                        Log in to Movie App
                    </Text>

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
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don&apos;t have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
