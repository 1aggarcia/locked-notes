import { View } from "react-native"
import { getStyles } from "../../util/services/styles";

export interface PinVisualizerProps {
    /** maximun length of PIN */
    max: number,

    /** current number of digits entered */
    currentLength: number
}

/** @requires props: max >= currentLength */
export default function PinVisualizer(props: PinVisualizerProps) {
    if (props.max < props.currentLength)
        throw RangeError('props.max < props.currentLength');

    const dots: JSX.Element[] = []
    const styles = getStyles();

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