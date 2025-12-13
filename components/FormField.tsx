import { useState } from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface FormFieldProps {
    title: string;
    value: string;
    placeholder?: string;
    handleChangeText: (e: string) => void;
    otherStyles?: string;
    keyboardType?: KeyboardTypeOptions;
    onBlur?: () => void;
}

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    error,
    ...props
}: FormFieldProps & { error?: string }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-medium font-pmedium">{title}</Text>

            <View className={`w-full h-16 px-4 bg-black-100 rounded-2xl border-2 flex flex-row items-center ${error ? 'border-red-500' : 'border-black-200 focus:border-secondary'}`}>
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props}
                />
            </View>
            {error && <Text className="text-red-500 text-sm font-pmedium">{error}</Text>}
        </View>
    );
};

export default FormField;
