import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { useStyles, useTranslation } from "../../shared/contexts/settingsContext";
import { LANGUAGE_NAMES, LANGUAGES, SupportedLanguage } from "../../shared/services/translator";
import AppText from "../../shared/components/AppText";
import { SettingsText } from "../settingsText";

export function LanguageDropdown(props: {
    isOpen: boolean;
    selectedLanguage: SupportedLanguage;
    onLanguageChange: (option: SupportedLanguage) => void;
    /**
     * Called whenever the user presses outside the dropdown OR selects
     * one of the options
     */
    onClose: () => void;
}) {
    const text = useTranslation(SettingsText);
    const { styles } = useStyles();

    const getOptionStyle = (language: SupportedLanguage) =>
        language === props.selectedLanguage
            ? styles.dropdownSelectedOption
            : styles.dropdownOption;

    const options = LANGUAGES.map(language => (
        <View style={styles.dropdownOptionContainer}>
            <TouchableOpacity
                key={language}
                onPress={() => {
                    props.onLanguageChange(language);
                    props.onClose();
                }}
            >
                <AppText style={getOptionStyle(language)}>
                    {LANGUAGE_NAMES[language]}
                </AppText>
            </TouchableOpacity>
        </View>
    ));

    return (
        <Modal
            transparent
            animationType="fade"
            visible={props.isOpen}
        >
            <Pressable
                style={[styles.modalBg, styles.centered]}
                onPress={props.onClose}
            >
                <Pressable style={styles.modal}>
                    <AppText style={{ padding: 10 }}>
                        {text.SELECT_LANGUAGE}
                    </AppText>
                    {options}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
