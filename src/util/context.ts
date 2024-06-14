import { createContext, useState } from "react";
import { LoginInfo } from "./storage/securestore";

type LoginDispatchTuple = [LoginInfo, (newLogin: LoginInfo) => void];

export const LoginContext = createContext<LoginDispatchTuple>([
    { hash: "", salt: "" },
    () => { 
        throw new ReferenceError("Using login context without a provider");
    }
]);
