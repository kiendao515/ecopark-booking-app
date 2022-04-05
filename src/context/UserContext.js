import React, { useContext, useState, useEffect, createContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

function UserContextProvider({ children }) {
    // Initialize state
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data
    useEffect(() => {
        async function getInfo() {
            const info = await AsyncStorage.getItem("info")
            setIsLoading(false)
            setData(info)
        }
    }, []);
    return (
        <UserContextProvider value={{ data }} loading={isLoading}>
            {children}
        </UserContextProvider>
    );
}

export default UserContextProvider;

// Create a hook to use the APIContext, this is a Kent C. Dodds pattern
export function useUserInfo() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}