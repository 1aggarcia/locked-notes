import { useState } from 'react';
import { View, Switch } from 'react-native';
import EditNote from '../components/EditNote';
import ViewNote from '../components/ViewNote';

export interface NoteProps {
    note: {
        title: string,
        body: string,
        dateCreated: string,
        dateModified: string,
    }
}

export default function Note(props: NoteProps) {
    const [title, setTitle] = useState(props.note.title);
    const [body, setBody] = useState(props.note.body);
    const [editing, setEditing] = useState(false);

    return (
        <View style={{flex: 1}}>
            <Switch value={editing} onValueChange={setEditing}/>
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