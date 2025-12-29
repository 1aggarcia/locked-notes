import { createContext, Dispatch, PropsWithChildren, useContext, useEffect, useReducer } from "react";
import { ColorTheme, Themes } from "../../assets/colors";
import { AppStylesheet, generateStyles } from "../../assets/styles";
import { DisplayTextRecord, getTranslations, SupportedLanguage } from "../services/translator";
import { getSettingsAsync } from "../services/securestore";
import showErrorDialog from "../util/error";

type ColorThemeArgs = { isDarkMode: boolean, isLowContrast: boolean };

type SettingsState = {
    language: SupportedLanguage;
    styles: {
        styles: AppStylesheet;
        colorTheme: ColorTheme;
        isDarkMode: boolean;
    };
}

type ReducerAction =
    | { type: "setColorTheme", data: ColorThemeArgs }
    | { type: "setLanguage", data: SupportedLanguage }

const initState: SettingsState = {
    language: "en",
    styles: {
        styles: generateStyles(Themes.LIGHT),
        colorTheme: Themes.LIGHT,
        isDarkMode: false,
    },
};

const SettingsContext = createContext<null | {
    state: SettingsState,
    dispatch: Dispatch<ReducerAction>
}>(null);


// Hooks for usage within SettingsProvider

export function useStyles() {
    return useSettings().state.styles;
}

// TODO: figure out a way to cache this
export function useTranslation<T extends DisplayTextRecord>(textRecord: T) {
    return getTranslations(textRecord, useSettings().state.language);
}

export function useSetColorTheme() {
    // the call to get settings context must be done eagerly, if done lazily
    // we risk not being inside a component when dispatch is called
    const settings = useSettings();
    return (args: ColorThemeArgs) => settings.dispatch({
        type: "setColorTheme",
        data: args
    });
}

export function useSetLanguage() {
    const settings = useSettings();
    return (language: SupportedLanguage) => settings.dispatch({
        type: "setLanguage",
        data: language,
    });
}

/**
 * Allows child components to hook onto the settings state, loaded
 * automatically from disk, using the below hooks:
 * - `useStyles`
 * - `useSetColorTheme`
 * - `useSetLanguage`
 * - `useTranslation`
 */
export function SettingsProvider(props: PropsWithChildren) {
    const [state, dispatch] = useReducer(reduceState, initState);

    useEffect(() => void loadSettings(), []);

    async function loadSettings() {
        try {
            const settings = await getSettingsAsync();
            const colorThemeArgs = {
                isDarkMode: settings.darkMode,
                isLowContrast: settings.lowContrast
            };
            dispatch({ type: "setColorTheme", data: colorThemeArgs });
            dispatch({ type: "setLanguage", data: settings.language });
        } catch (error) {
            showErrorDialog(error);
        }
    }

    return (
        <SettingsContext.Provider value={{ state, dispatch }}>
            {props.children}
        </SettingsContext.Provider>
    );
}

function useSettings() {
    const context = useContext(SettingsContext);
    if (context === null) {
        throw new ReferenceError("Using settings context without provider");
    }
    return context;
}

function reduceState(
    state: SettingsState, action: ReducerAction
): SettingsState {
    switch (action.type) {
    case "setColorTheme":
        return {
            ...state,
            styles: getStylesState(action.data),
        };
    case "setLanguage":
        return {
            ...state,
            language: action.data,
        };
    }
}

/**
 * Generates a styles state object given the
 * flags `isDarkMode` and `isLowContrast`
 * @param param0 An object specifying `isDarkMode` and `isLowContrast`
 * @returns A new styles state with a stylesheet, color theme, and flag
 * indicating dark mode
 */
function getStylesState({ isDarkMode, isLowContrast }: ColorThemeArgs) {
    const theme = getColorTheme(isDarkMode, isLowContrast);
    return {
        styles: generateStyles(theme),
        colorTheme: theme,
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
