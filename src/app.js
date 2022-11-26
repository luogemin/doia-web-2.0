import React, {useEffect} from 'react';
import {
    ConfigProvider,
    ThemeProvider,
    ErrorBoundary,
} from '@chaoswise/ui';

import {useIntl} from "react-intl";

import Router from '@/config/router.config';
import 'monaco-editor/esm/vs/language/json/monaco.contribution.js';

// 国际化
import zh_antd from 'antd/es/locale/zh_CN';
import en_antd from 'antd/es/locale/en_US';

import zh_local from '@/lang/zh';
import en_local from '@/lang/en';

// 主应用qiankun actions
import actions from '@/shared/mainActions';

import darkTheme from '../config/themes/dark';
import lightTheme from '../config/themes/light';

// 鉴权
import authWrapper from '@/components/authWrapper';

import {Provider, use, loadingStore} from '@chaoswise/cw-mobx';

// src/app.js
const publicpath = process.env.PUBLIC_PATH || '/';

const themes = {
    light: `${publicpath}index-light.css`,
    dark: `${publicpath}index-dark.css`,
};

// 国际化配置
const lang = {
    zh: {
        antdLocale: zh_antd,
        momentLocale: 'zh-ch',
        intlLocale: "zh-Hans-CN",
        messages: {
            "a": 'a',
            ...zh_local
        }
    },
    en: {
        antdLocale: en_antd,
        momentLocale: 'en',
        intlLocale: "en",
        messages: {
            "a": 'i m a',
            ...en_local
        }
    },
};

const defaultTheme = 'dark';
const defaultLocale = localStorage.getItem('language') || 'zh';

const App = ({getAuth}) => {
    useEffect(() => {
        // 主应用注册共享状态
        actions.setGlobalState({
            theme: defaultTheme,
            locale: defaultLocale
        });
    }, []);

    const InitIntl = ({children}) => {
        window._intl_ = useIntl();
        return children;
    };

    const RenderR = () => {
        const stores = require('./stores').default;

        return (
            <Provider
                {...use(stores)}
                loadingStore={loadingStore}
            >
                <Router
                    basename={window.DOIA_CONFIG.basename}
                    getAuth={getAuth} //鉴权
                />
            </Provider>
        );
    };

    return (
        <ErrorBoundary>
            <ThemeProvider
                defaultTheme={defaultTheme}
                themeMap={themes}
                useMultipleTheme={false}
                themeVars={{
                    light: lightTheme,
                    dark: darkTheme
                }}
            >
                <ConfigProvider
                    locales={lang}
                    defaultLocale={defaultLocale}
                >
                    <InitIntl>
                        <RenderR/>
                    </InitIntl>
                </ConfigProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default authWrapper(App);
