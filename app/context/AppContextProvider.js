import React, {useState, useEffect} from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { themeLight, themeDark } from '../theme/themeColors';
import { useStores } from '../models';

export const AppContext = React.createContext(null);

export const AppContextProvider = ({ children }) => {
    const { themeStore } = useStores()
    const [theme, setTheme] = useState(themeLight);


    /* useEffect(() => {
        setTheme(themeStore.themeColor === 'light' ? themeLight : themeDark);
    }, [themeStore.theme]); */

    return (
        <AppContext.Provider value={{ theme, setTheme }}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </AppContext.Provider>
    );
};