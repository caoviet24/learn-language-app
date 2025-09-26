

import React from 'react'
import ReactQueryProvider from './react-query-provider'
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <I18nextProvider i18n={i18n}>
                <ReactQueryProvider>
                    {children}
                </ReactQueryProvider>
            </I18nextProvider>
        </React.Fragment>
    )
}
