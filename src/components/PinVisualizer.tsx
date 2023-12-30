import { View, StyleSheet } from "react-native"
import colors from "../assets/colors";

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
                list.push(<View key={i} style={[styles.dot, styles.dotFull]} />);
            } else {
                list.push(<View key={i} style={styles.dot} />)
            }
        }
        return list;
    }

    return (
        <View style={styles.container}>
            {createDots()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    dot: {
        width: 15,
        height: 15,
        borderRadius: 20,
        borderColor: colors.border,
        borderWidth: 2,
    },
    dotFull: {
        backgroundColor: colors.border
    }
});