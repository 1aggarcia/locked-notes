import { View } from "react-native"
import styles from "../modules/styles";

export interface PinVisualizerProps {
    max: number,
    currentLength: number
}

/**
 * @requires props: max >= currentLength
 */
export default function PinVisualizer(props: PinVisualizerProps) {
    if (props.max < props.currentLength) {
        throw RangeError('props.max < props.currentLength');
    }

    function createDots(): JSX.Element[] {
        let list = []
        for (let i = 0; i < props.max; i++) {
            if (i < props.currentLength) {
                list.push(<View key={i} style={[styles.pinDot, styles.pinDotFull]} />);
            } else {
                list.push(<View key={i} style={styles.pinDot} />)
            }
        }
        return list;
    }

    return (
        <View style={styles.pinDots}>
            {createDots()}
        </View>
    )
}