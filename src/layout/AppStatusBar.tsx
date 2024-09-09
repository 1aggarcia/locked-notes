import { StatusBar } from "expo-status-bar";
import { useStyles } from "../shared/contexts/stylesContext";

/**
 * Wrapper for the expo status bar so that the color theme
 * automatically updates when the style changes
 */
export default function AppStatusBar() {
    const styles = useStyles();
    return <StatusBar style={styles.isDarkMode ? "light" : "dark" } />
}
