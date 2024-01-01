import { useState } from "react";
import AppText from "../components/AppText";

interface LockedProps {
    // Callback function to set nav page to unlocked
    unlock: () => void;
    
    // Callback function to set nav page to access denied
    denyAccess: () => void;
}

const maxAttempts = 3;

export default function Locked(props: LockedProps) {
    const [inputHash, setInputHash] = useState();
    const [attempts, setAttempts] = useState(0);

    return (
        <AppText>Locked</AppText>
    )
}