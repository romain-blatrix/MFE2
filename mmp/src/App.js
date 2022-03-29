import React from "react";
import {LibraryProvider, useLibraryContext} from "provider-library";

const App = () => (
    <LibraryProvider appName="mmp">
      <div>
        <h1>MMP</h1>
        <MMPComponent />
      </div>
    </LibraryProvider>
);

function MMPComponent() {
    const libraryContext = useLibraryContext();

    return (
        <div>
            <h2>Content inside MMP</h2>
            <div>
                The application in the context is: {libraryContext.appName}
            </div>
        </div>
    )
}

export default App;
