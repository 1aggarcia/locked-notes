import { View } from "react-native"
import { useStyles } from "../../shared/contexts/settingsContext";

export interface PinVisualizerProps {
    /** maximum length of PIN */
    max: number,

    /** current number of digits entered */
    currentLength: number
}

/** @requires props: max >= currentLength */
export default function PinVisualizer(props: PinVisualizerProps) {
    if (props.max < props.currentLength)
        throw RangeError('props.max < props.currentLength');

    const dots: JSX.Element[] = []
    const { styles } = useStyles(); 

    // Generate array of JSX dots based on props
    for (let i = 0; i < props.max; i++) {
        if (i < props.currentLength) {
            dots.push(<View key={i} style={[styles.pinDot, styles.pinDotFull]} />);
        } else {
            dots.push(<View key={i} style={styles.pinDot} />)
        }
    }

    return (
        <View style={styles.pinDots}>
            {dots}
        </View>
    );
}