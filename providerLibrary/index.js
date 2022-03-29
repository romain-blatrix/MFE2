import React, {useContext, useMemo} from 'react';

const LibraryContext = React.createContext();

export const useLibraryContext = () => useContext(LibraryContext);

export function LibraryProvider({ children, appName }) {
    const value = useMemo(() => ({ appName }), [appName]);
    const parentContext = useLibraryContext();

    // Already a context upper in the tree
    // Do not wrap byt another Provider
    if (parentContext) {
        return children;
    }

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
}
