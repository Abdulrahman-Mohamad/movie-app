import { getCurrentUser } from "@/services/appwrite";
import { createContext, useContext, useEffect, useState } from "react";

interface GlobalContextType {
    isLogged: boolean;
    setIsLogged: (value: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const GlobalContext = createContext<GlobalContextType>({
    isLogged: false,
    setIsLogged: () => { },
    user: null,
    setUser: () => { },
    loading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLogged(true);
                    setUser(res as unknown as User);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                loading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
