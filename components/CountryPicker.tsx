import { countries } from "@/constants/countries";
import { icons } from "@/constants/icons";
import { useState } from "react";
import { FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

interface CountryPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (country: typeof countries[0]) => void;
}

const CountryPicker = ({ visible, onClose, onSelect }: CountryPickerProps) => {
    const [search, setSearch] = useState("");

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View className="flex-1 bg-primary/90 justify-end">
                <View className="bg-black-100 h-[70%] rounded-t-3xl p-5">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-white text-xl font-psemibold">Select Country</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Image source={icons.arrow} className="w-6 h-6 -rotate-90" resizeMode="contain" tintColor="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View className="w-full h-14 px-4 bg-black-200 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center mb-5">
                        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" tintColor="#CDCDE0" />
                        <TextInput
                            className="flex-1 text-white font-pregular text-base ml-2"
                            placeholder="Search country..."
                            placeholderTextColor="#CDCDE0"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="py-4 border-b border-black-200 flex-row justify-between items-center"
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text className="text-white font-pmedium text-lg">{item.name}</Text>
                                <Text className="text-gray-100 font-pregular text-base">+{item.phone}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default CountryPicker;
