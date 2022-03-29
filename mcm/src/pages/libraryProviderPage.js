import React, {useState} from 'react';
import {useLibraryContext} from "provider-library";

export default function LibraryProviderPage({ title }) {
    const libraryContext = useLibraryContext();

    return (
        <div>
            <h2>{title}</h2>
            <div>
                The application in the context is: {libraryContext ? libraryContext.appName : 'No context'}
            </div>
        </div>
    )
}
