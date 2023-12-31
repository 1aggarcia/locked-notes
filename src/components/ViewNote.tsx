import { Text, StyleSheet, ScrollView } from 'react-native'


export interface ViewNoteProps {
    title: string;
    body: string;
}

export default function ViewNote(props: ViewNoteProps) {
    return(
        <ScrollView style={{flex: 1}}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.body}>{props.body}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 15,
        paddingBottom: 5,
    },
    body: {
        flex: 1,
        fontSize: 18,
        padding: 15,
        paddingTop: 5,
    }
});