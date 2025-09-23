

import React from 'react'
import ReactQueryProvider from './react-query-provider'

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <ReactQueryProvider>
                {children}
            </ReactQueryProvider>
        </React.Fragment>
    )
}
