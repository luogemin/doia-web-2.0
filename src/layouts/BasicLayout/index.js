import React, {useEffect, useMemo, useRef} from 'react';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useHistory} from 'react-router-dom';
import {
    BasicLayout as Layout,
    Icon,
    ThemeProvider,
    ConfigProvider
} from '@chaoswise/ui';
import actions from '@/shared/mainActions';
import {getNacosConfig, getDoucIcon} from '@/services/auth';
import {changeBrowserLogo} from "@/utils/common";
import {formatType, isInPortal, PATH_MAP,formatTypeCreate} from "@/globalConstants";
import styles from './index.less';
import logo from '@/layouts/BasicLayout/assets/logo.svg';
import dashboard from '@/layouts/BasicLayout/assets/dashboard.svg';
import generics from '@/layouts/BasicLayout/assets/generics.svg';
import datasource from '@/layouts/BasicLayout/assets/datasource.svg';
import laboratory from '@/layouts/BasicLayout/assets/laboratory.svg';
import task from '@/layouts/BasicLayout/assets/task.svg';
import multitenancy from '@/layouts/BasicLayout/assets/multitenancy.svg';
import setting from '@/layouts/BasicLayout/assets/setting.svg';
import {getGroupBySceneAsync} from "@/utils/auth";
import {IntlFormatMessage} from "@/utils/util";


const iconConf = {
    dashboard,
    generics,
    datasource,
    laboratory,
    task,
    multitenancy,
    setting,
};

const routesList = [
    {
        path: '/dashboard',
        name: IntlFormatMessage('dashboard.name'),
        noLayout: true,
    },
    {
        path: '/generics',
        name: IntlFormatMessage('generics.name'),
    },
    {
        path: '/datasource',
        name: IntlFormatMessage('datasource.name'),
    },
    {
        path: '/task/anomaly_detection',
        name: IntlFormatMessage('task.anomaly.name'),
    }, {
        path: '/task/forecasting',
        name: IntlFormatMessage('task.single.name'),
    },
    {
        path: '/monitor',
        name: '自监控',
    },
    {
        path: '/multitenancy',
        name: IntlFormatMessage('multitenancy.name'),
    },
    {
        path: '/laboratory',
        name: IntlFormatMessage('laboratory.name'),
    },
    {
        path: '/setting',
        name: IntlFormatMessage('setting.name'),
    },
];

const BasicLayout = (props) => {
    const {
        children, route, backTitle, setBackTitle, versionData, getVersionAsync,
        deleteDataSourceInfo,
    } = props;

    const history = useHistory();
    const routeMap = useRef({});

    const {currentTheme} = ThemeProvider.useThemeSwitcher();
    const {locale} = ConfigProvider.useLocale();

    useEffect(() => {
        if (!window.DOIA_CONFIG.dataSceneTypeList.length) {
            getGroupBySceneAsync().then(res => {
                if (!!res && !!res.data) {
                    window.DOIA_CONFIG.dataSceneTypeList = Object.entries(res.data).map(item => {
                        const {displayNames = {}} = item[1];
                        return Object.assign({}, item[1], {
                            title: displayNames,
                            type: item[1].name,
                        });
                    });
                }
            });
        }
    }, []);

    let flushTimer = null;

    // useEffect(() => {
    //     // 更新全局状态通知子应用
    //     actions.setGlobalState({
    //         theme: currentTheme
    //     });
    // }, [currentTheme]);
    //
    // useEffect(() => {
    //     // 更新全局状态通知子应用
    //     actions.setGlobalState({
    //         locale
    //     });
    // }, [locale]);

    //定时刷新--主要解决grafana session失效问题--维持session存活
    // useEffect(() => {
    //     getVersionAsync(true);
    //     flushTimer = setInterval(function () {
    //         getVersionAsync(true);
    //     }, 30 * 1000);
    //     return () => clearInterval(flushTimer);
    // }, [getVersionAsync]);

    // useEffect(() => {
    //     //获取nacos配置
    //     let nacosConfig = getNacosConfig();
    //     if (nacosConfig) localStorage.setItem('nacosConfig', JSON.stringify(nacosConfig.data));
    //
    //     //从douc获取logo
    //     getDoucIcon().then(res => {
    //         //替换标签页icon
    //         if (res && res.code === 100000) {
    //             const {
    //                 logoData = ''
    //             } = res.data || {};
    //             changeBrowserLogo(logoData);
    //         }
    //     });
    // }, []);

    /**
     * 通过路由配置文件生成menuData
     * @param {Arrary} routeData 路由配置
     * @param {Arrary} menuAuth 菜单权限
     */
    const getMenuData = (routeData, menuAuth = []) => {
        return routeData.filter(item => {
            // 是否可见
            if (item.hideInMenu) {
                return false;
            }
            // 权限
            if (item.check && !(menuAuth.includes(item.id))) {
                return false;
            }
            // 非redirect配置
            if (!item.redirect && item.component) {
                return true;
            }
            return false;
        }).map(item => {
            //自定义菜单栏icon
            let _icon = null;
            if (item.userDefinedIcon) {
                _icon = <img className={styles["menu-icon"]} src={iconConf[item.userDefinedIcon]}/>;
            } else {
                _icon = item.icon ? <Icon type={item.icon} theme="filled"/> : null;
            }
            let _name = item.name;
            if (item.intlId) {
                _name = IntlFormatMessage(item.intlId);
                // _name = <span style={{whiteSpace:'pre-wrap'}}>{IntlFormatMessage(item.intlId)}</span>
            }
            if (item.routes) {
                return {
                    ...item,
                    name: _name,
                    key: item.path,
                    pathName: item.path,
                    children: getMenuData(item.routes, menuAuth),
                    icon: _icon
                };
            }
            return {
                ...item,
                name: _name,
                key: item.path,
                pathName: item.path,
                icon: _icon
            };
        });
    };

    const onPathChange = e => {
        if (e.key === history.location.pathname) {
            return;
        }
        history.push(e.key);
    };

    const menuData = getMenuData(route.routes || [], []);

    //设置详情页，返回按钮后的文字
    const {location = {}} = history;
    const {pathname = ''} = location;
    useEffect(() => {
        routesList.forEach(item => {
            const realPath = item.path;
            if (realPath) {
                routeMap.current[realPath] = item;
            }
            if (pathname === realPath) {
                setBackTitle(item.name);
            }
        });

        const type = pathname.slice(pathname.indexOf('type') + 5);
        if (pathname.indexOf('/dashboard/detail/type') > -1) {
            // setBackTitle(`${formatType(type)}算法`);
        } else if (pathname.indexOf('/generics/create') > -1) {
            setBackTitle(`${IntlFormatMessage(formatTypeCreate(type))}`);
        } else if (pathname.indexOf('/datasource/create') > -1) {
            setBackTitle(`${IntlFormatMessage('laboratory.anomaly.add')}${IntlFormatMessage(formatType(type))}${IntlFormatMessage('laboratory.anomaly.EmptyData')}`);
        } else if (pathname.indexOf('/task') > -1 && pathname.indexOf('/create') > -1) {
            setBackTitle(localStorage.getItem('language') === 'zh' ? `新建任务` : `Create task`);
        } else if (pathname.indexOf('/laboratory/create') > -1) {
            setBackTitle(localStorage.getItem('language') === 'zh' ? `新建任务` : `Create`);
        } else if (pathname === '/multitenancy/create') {
            setBackTitle(localStorage.getItem('language') === 'zh' ? `新建场景` : `Create scenario`);
        }

        if (pathname !== '/datasource/create/type/KAFKA') {
            deleteDataSourceInfo();
        }
    }, [pathname]);

    const currentRouteConfig = routeMap.current[pathname] || {};
    const {noLayout = false} = currentRouteConfig;

    const listPage = useMemo(() => {
        return routesList.map(item => item.name);
    }, [routesList]);

    return (
        <Layout
            logo={<img src={logo}/>}
            headerTitle='DOIA'
            showHead={!isInPortal()} // 集成portal不显示头部
            className={'doia-layout-wrapper'}
            showTopNavigation={false}
            showBack={true}
            customContent={noLayout} //无面包屑预设，内容取自定义
            backNavigationTitle={backTitle ? backTitle : IntlFormatMessage('datasource.create.back')}
            backIcon={listPage.includes(backTitle) ? false : <Icon type={'left'}/>}
            onClickBack={() => {
                if (listPage.includes(backTitle)) {
                    return false;
                }
                if (pathname.indexOf('/laboratory/anomaly_detection/') > -1) {
                    history.push('/laboratory');
                } else {
                    history.go(-1);
                }
            }}
            menuOptions={{
                menuData: menuData,
                selectedKeys: [PATH_MAP(pathname)],
                onClick: onPathChange
            }}
            // version={versionData.version}
            // versionTooltip={`版本号${versionData.versionDetail}`}
        >
            {children}
        </Layout>
    );
};

export default connect(({store, globalStore, dataSourceStore, laboratoryStore}) => {
    return {
        backTitle: store.backTitle,
        setBackTitle: store.setBackTitle,
        versionData: globalStore.versionData,
        deleteDataSourceInfo: dataSourceStore.deleteDataSourceInfo,
        getVersionAsync: globalStore.getVersionAsync,
    };
})(BasicLayout);
