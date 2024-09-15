import { createContext, useContext, useState } from "react";

const MetamaskContext = createContext();

export const useEthereum = () => useContext(MetamaskContext);

export const MetamaskProvider = ({ children }) => {

    const [eth, setEth] = useState(null);

    addEventListener('load', () => {
        if ('ethereum' in window) {
            setEth(ethereum);
        }
    })

    return (
        <MetamaskContext.Provider value={{ eth }}>
            {children}
        </MetamaskContext.Provider>
    )
}