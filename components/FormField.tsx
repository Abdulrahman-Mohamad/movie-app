import { useState } from "react";
import { KeyboardTypeOptions, Text, TextInput, TextInputProps, View } from "react-native";

interface FormFieldProps extends TextInputProps {
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
    prefix,
    ...props
}: FormFieldProps & { error?: string; prefix?: string }) => {
    const [showPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-medium font-pmedium">{title}</Text>

            <View className={`w-full px-4 bg-[#1C1C1E] rounded-2xl border-2 flex flex-row items-center ${error ? 'border-red-500' : 'border-black-200 focus:border-secondary'} ${props.multiline ? 'h-32 items-start py-4' : 'h-16'}`}>
                {prefix && (
                    <Text className="text-white font-psemibold text-base mr-2">{prefix}</Text>
                )}
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
