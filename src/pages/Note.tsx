import { useState } from 'react';
import { View, Text } from 'react-native';
import EditNote from '../components/EditNote';
import ViewNote from '../components/ViewNote';

export interface NoteProps {
    title: string
    body: string
}

export default function Note(props: NoteProps) {
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    const [editing, setEditing] = useState(true);

    return (
        <View style={{flex: 1}}>
            {
                editing?
                <EditNote 
                    title={title} body={body}
                    setTitle={setTitle} setBody={setBody}
                />
                :
                <ViewNote title={title} body={body} />
            }
        </View>
    )
}