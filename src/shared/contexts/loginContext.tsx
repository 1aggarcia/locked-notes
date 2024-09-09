import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getLoginAsync, LoginInfo } from "../services/securestore";
import showErrorDialog from "../util/error";

type LoginState = {
    status: "Loading" | "Defined" | "Undefined"
    login: LoginInfo,
}

const defaultState: LoginState = {
    status: "Undefined",
    login: { hash: "", salt: "" },
};

const LoginContext = createContext(defaultState);
const SetLoginContext = createContext(
    (_: typeof defaultState): void => {
        throw new ReferenceError("Using login context without a provider");
    }
);

export const useLogin = () => useContext(LoginContext);
export const useSetLogin = () => useContext(SetLoginContext);

export function LoginProvider(props: PropsWithChildren) {
    const [loginState, setLoginState] = useState(defaultState);

    useEffect(() => { loadLogin() }, []);

    async function loadLogin() {
        setLoginState({ ...loginState, status: "Loading"});
        try {
            const savedLogin = await getLoginAsync();
            if (savedLogin !== null)
                setLoginState({ login: savedLogin, status: "Defined" });
            else
                setLoginState({ ...loginState, status: "Undefined"});
        } catch (error) {
            showErrorDialog(error);
        }
    }

    return (
        <LoginContext.Provider value={loginState}>
            <SetLoginContext.Provider value={setLoginState}>
                {props.children}
            </SetLoginContext.Provider>
        </LoginContext.Provider>
    )
}
