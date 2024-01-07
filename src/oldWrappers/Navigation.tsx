import { useState, useEffect } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getLoginInfo } from '../modules/file-service';

import Unlocked from "./Unlocked";
import Locked from '../oldPages/Locked';
import Denied from '../oldPages/Denied';
import Loading from '../oldPages/Loading';
import { View } from 'react-native';
import styles from '../modules/styles';

const Stack = createNativeStackNavigator();

type Page = 'Denied' | 'Locked' | 'Unlocked' | 'Loading'

interface NavigationProps {
    // Callback function to navigate to create pin page
    goToCreatePin: () => void
}

export default function Navigation() {
    const [page, setPage] = useState<Page>('Loading');
    const [hash, setHash] = useState<string>();
    const [salt, setSalt] = useState<string>();

    const insets = useSafeAreaInsets();

    // Load hash and salt from local storage
    useEffect(() => {
        async function loadLogin() {
            const loginInfo = await getLoginInfo();

            if (loginInfo === null) {
                // Pin does not exist: send user to make one
                // props.goToCreatePin();
            } else {
                setHash(loginInfo.hash);
                setSalt(loginInfo.salt);
                setPage('Locked');
            }
        }
        loadLogin();
    }, [])

    // return (
    //     <Stack.Navigator initialRouteName={page}>
    //         <Stack.Screen name='Loading' component={Loading} />
    //         <Stack.Screen name='Denied' component={Denied} />
    //         <Stack.Screen 
    //             name='Locked'
    //             component={Locked}
    //             options={{ headerShown: false }}
    //         />
    //     </Stack.Navigator>
    // )

    return (
        <View style={[styles.app, {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }]}>
            {page === 'Loading' &&  <Loading />}
            {page === 'Denied' &&  <Denied />}
            {page === 'Locked' && hash !== undefined && salt !== undefined &&
                <Locked
                    hash={hash}
                    salt={salt}
                    unlock={() => setPage('Unlocked')}
                    denyAccess={() => setPage('Denied')}
                />
            }
            {page === 'Unlocked' &&
                <Unlocked 
                    page='NoteList'
                    lock={() => setPage('Locked')}
                    denyAccess={() => setPage('Denied')}
                />
            }
        </View>
    )

    // switch(page) {
    //     case 'Loading':
    //         return <Loading />;
    //     case 'Denied':
    //         return <Denied />;
    //     case 'Locked':
    //         if (hash === undefined || salt === undefined) {
    //             throw Error('Bad state: hash or salt missing');
    //         }
    //         return <Locked
    //             hash={hash}
    //             salt={salt}
    //             unlock={() => setPage('Unlocked')}
    //             denyAccess={() => setPage('Denied')}
    //         />
    //     case 'Unlocked':
    //         return <Unlocked 
    //             page='NoteList'
    //             lock={() => setPage('Locked')}
    //             denyAccess={() => setPage('Denied')}
    //         />
    // }
}