import React, {Component, useEffect,} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {Row, Col} from '@chaoswise/ui';
import styles from './index.less';
import {dataSceneTypeObj, formatType} from "@/globalConstants";

const Dashboard = (props) => {
    const {
        match = {}, history, getGroupBySceneAsync, dashboard,
    } = props;
    const {path = ""} = match;


    useEffect(() => {
        // if (!window.DOIA_CONFIG.dataSceneTypeList.length) {
        getGroupBySceneAsync();
        // }
    }, []);

    return (
        <div className={styles['dashboard']}>
            {
                (dashboard.length ? dashboard : window.DOIA_CONFIG.dataSceneTypeList).map((item, index) => {
                    const {name = '', displayNames, algorithmNames = [], displayDescriptions} = item;

                    const {icon = {}, dot = '', info = ''} = dataSceneTypeObj[name] || {};
                    return (
                        <div
                            key={index}
                            className="dashboard-item"
                            style={{
                                // backgroundImage: `url(${icon})`,
                                cursor: algorithmNames.length ? 'pointer' : 'default',
                            }}
                            onClick={() => {
                                if (algorithmNames.length) {
                                    history.push(`${path}/detail/type/${name}`);
                                }
                            }}
                        >
                            <p className="title">
                                {displayNames}
                                （{algorithmNames.length}）
                                {/*<img src={dot} alt={name}/>*/}
                            </p>
                            <img src={icon[localStorage.getItem('language')]} alt={item.type} className="item-img-box"/>
                            <div className="mantle-box">
                                <p className="mantle-title">{displayNames}</p>
                                <p className="mantle-info">
                                    {displayDescriptions}
                                </p>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default connect(({dashboardStore, store}) => {
    return {
        getGroupBySceneAsync: dashboardStore.getGroupBySceneAsync,
        dashboard: dashboardStore.dashboard,
    };
})(Dashboard);
