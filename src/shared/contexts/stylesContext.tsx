import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState
} from "react";
import { Themes } from "../../assets/colors";
import { getSettingsAsync } from "../services/securestore";
import showErrorDialog from "../util/error";
import { generateStyles } from "../../assets/styles";

type ColorThemeArgs = { isDarkMode: boolean, isLowContrast: boolean };

const defualtState = {
    styles: generateStyles(Themes.LIGHT),
    colorTheme: Themes.LIGHT,
    isDarkMode: false
}

const StylesContext = createContext(defualtState);
const ColorThemeContext = createContext(
    (_: ColorThemeArgs): void => {
        // React forces us to define this function
        throw new ReferenceError("Using context without provider");
    }
);

export const useStyles = () => useContext(StylesContext);
export const useSetColorTheme = () => useContext(ColorThemeContext);

/**
 * Allows child components to hook onto the stylesheet state with
 * `useStyles` and `useSetColorTheme`
 */
export function StylesProvider(props: PropsWithChildren) {
    const [styles, setStyles] = useState(defualtState);

    useEffect(() => { loadStyles() }, []);

    async function loadStyles() {
        try {
            const settings = await getSettingsAsync();
            setColorTheme({
                isDarkMode: settings.darkMode,
                isLowContrast: settings.lowContrast
            });
            console.debug("styles loaded");
        } catch (error) {
            showErrorDialog(error);
        }
    }

    function setColorTheme(args: ColorThemeArgs) {
        setStyles(getStylesState(args))
    }

    return (
        <StylesContext.Provider value={styles}>
            <ColorThemeContext.Provider value={setColorTheme}>
                {props.children}
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
