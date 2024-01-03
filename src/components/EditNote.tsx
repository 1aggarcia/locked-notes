// import { TextInput, ScrollView } from 'react-native'
// import { darkModeColors } from '../assets/colors';
// import styles from '../modules/styles';


// export interface EditNoteProps {
//     title: string;
//     body: string;
//     setTitle: (value: string) => void;
//     setBody: (value: string) => void;
// }

// export default function EditNote(props: EditNoteProps) {
//     return(
//         <ScrollView style={{flex: 1}}>
//             <TextInput 
//                 style={styles.noteTitle}
//                 value={props.title}
//                 onChangeText={props.setTitle}
//                 placeholder='Title'
//                 placeholderTextColor={darkModeColors.placeholder}
//                 editable={false}
//             />
//             <TextInput 
//                 style={styles.noteBody}
//                 value={props.body}
//                 onChangeText={props.setBody}
//                 placeholder='Body'
//                 placeholderTextColor={darkModeColors.placeholder}
//                 multiline
//                 editable={false}
//             />
//         </ScrollView>
//     )
// }