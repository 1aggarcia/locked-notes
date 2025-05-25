import {
    Context,
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState
} from "react";
import { Themes } from "../../assets/colors";
import { getSettingsAsync } from "../services/securestore";
import showErrorDialog from "../util/error";
import { AppStylesheet, generateStyles } from "../../assets/styles";
import { DisplayTextRecord, DisplayTranslation, getTranslations, SupportedLanguage } from "../services/translator";

type ColorThemeArgs = { isDarkMode: boolean, isLowContrast: boolean };

const defaultState = {
    styles: generateStyles(Themes.LIGHT) as AppStylesheet,
    colorTheme: Themes.LIGHT,
    isDarkMode: false
}

const StylesContext = createContext(defaultState);
const ColorThemeContext = createContext(
    ({ isDarkMode, isLowContrast }: ColorThemeArgs): void => {
        // React forces us to define this function
        throw new ReferenceError("Using context without provider");
    }
);

const TranslationContext = createContext(
    <T extends DisplayTextRecord>(textRecord: T): DisplayTranslation<T> => {
        throw new ReferenceError();
    }
);

const SetLanguageContext = createContext(
    (language: SupportedLanguage): void => {
        throw new ReferenceError("Using context without provider")
    }
);

export const useStyles = () => useContext(StylesContext);
export const useSetColorTheme = () => useContext(ColorThemeContext);
export const useSetLanguage = () => useContext(SetLanguageContext);
export const useTranslation = <T extends DisplayTextRecord>(textRecord: T) =>
    useContext(TranslationContext)(textRecord);

/**
 * Allows child components to hook onto the settings state, loaded
 * automatically from disk, using the below hooks:
 * - `useStyles`
 * - `useSetColorTheme`
 * - `useAppText`
 * - `useSetLanguage`
 */
export function SettingsProvider(props: PropsWithChildren) {
    const [styles, setStyles] = useState(defaultState);
    const [language, setLanguage] = useState<SupportedLanguage>("en");

    useEffect(() => { loadSettings() }, []);

    async function loadSettings() {
        try {
            const settings = await getSettingsAsync();
            setColorTheme({
                isDarkMode: settings.darkMode,
                isLowContrast: settings.lowContrast
            });
            setLanguage(settings.language);
        } catch (error) {
            showErrorDialog(error);
        }
    }

    function setColorTheme(args: ColorThemeArgs) {
        setStyles(getStylesState(args))
    }
    function useTranslation<T extends DisplayTextRecord>(textRecord: T) {
        return getTranslations(textRecord, language);
    }

    return (
        <StylesContext.Provider value={styles}>
            <ColorThemeContext.Provider value={setColorTheme}>
                <SetLanguageContext.Provider value={setLanguage}>
                    <TranslationContext.Provider value={useTranslation}>
                        {props.children}
                    </TranslationContext.Provider>
                </SetLanguageContext.Provider>
            </ColorThemeContext.Provider>
        </StylesContext.Provider>
    )
}

/**
 * Generates a styles state object given the
 * flags `isDarkMode` and `isLowContrast`
 * @param param0 An object specifying `isDarkMode` and `isLowContrast`
 * @returns A new styles state with a stylesheet, color theme, and flag
 * indicating dark mode
 */
function getStylesState({ isDarkMode, isLowContrast }: ColorThemeArgs) {
    return {
        styles: generateStyles(getColorTheme(isDarkMode, isLowContrast)),
        colorTheme: getColorTheme(isDarkMode, isLowContrast),
        isDarkMode: isDarkMode,
    }
}

function getColorTheme(darkMode: boolean, lowContrast: boolean) {
    if (lowContrast) {
        return darkMode ? Themes.LOW_CONTRAST_DARK : Themes.LOW_CONTRAST_LIGHT;
    } else {
        return darkMode ? Themes.DARK : Themes.LIGHT;
    }
}
