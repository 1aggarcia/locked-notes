import Pin from "./Pin";

interface CreatePinProps {
    // Callback function to go to navigation page
    goToNavigation: () => void
}

export default function CreatePin(props: CreatePinProps) {
    return (<>
        <Pin unlock={props.goToNavigation}/>
    </>)
}