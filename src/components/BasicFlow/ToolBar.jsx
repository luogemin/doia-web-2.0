import React, {forwardRef, useEffect} from 'react';
import PluginWrapper from './components/flow/components/PluginWrapper';
import {Icon, Tooltip, Dropdown, Menu} from '@chaoswise/ui';
import {FormattedMessage, injectIntl} from 'react-intl';
import styles from './index.less'
import {IntlFormatMessage} from "@/utils/util";

const ToolBar = (props, ref) => {
    const {
        graph, selectNodeToCheck, setSelectNodeToCheck, changeCanvasSize, setChangeCanvasSize,
        lineType, setLineTypeReducer
    } = props;

    return <PluginWrapper className={styles['toolBars']} ref={ref} detailEnums={{
        zoomIn: {
            type: 'center',
            multiple: 1.2,
            max: 10
        },
        zoomOut: {
            type: 'center',
            multiple: 1.2,
            max: 0.1
        }
    }}>
        {/*<div className={'tool'}>*/}
        {/*    <Dropdown overlay={<Menu>*/}
        {/*        <Menu.Item onClick={() => {*/}
        {/*            setLineTypeReducer('line')*/}
        {/*        }}>*/}
        {/*            {IntlFormatMessage('laboratory.anomaly.lineStraight')}*/}
        {/*        </Menu.Item>*/}
        {/*        <Menu.Item onClick={() => {*/}
        {/*            setLineTypeReducer('polyline')*/}
        {/*        }}>*/}
        {/*            {IntlFormatMessage('laboratory.anomaly.lineBroken')}*/}
        {/*        </Menu.Item>*/}
        {/*        <Menu.Item onClick={() => {*/}
        {/*            setLineTypeReducer('arc')*/}
        {/*        }}>*/}
        {/*            {IntlFormatMessage('laboratory.anomaly.lineCurved')}*/}
        {/*        </Menu.Item>*/}
        {/*    </Menu>}>*/}
        {/*        <Tooltip title={IntlFormatMessage('laboratory.anomaly.typeLine')}>*/}
        {/*            <Icon type='radius-setting'/>*/}
        {/*        </Tooltip>*/}
        {/*    </Dropdown>*/}
        {/*</div>*/}
        <div className={'tool'} onClick={() => {
            const {clientWidth, clientHeight} = graph.cfg.container;
            const zoom = graph.getZoom();
            const size = {
                x: clientWidth / 2, y: clientHeight / 2
            };
            graph.zoomTo(zoom * 1.2, size);
        }}>
            <Tooltip title={<FormattedMessage id="btn.zoomIn.label"/>}>
                <Icon type='zoom-in'/>
            </Tooltip>
        </div>
        <div className={'tool'} onClick={() => {
            const {clientWidth, clientHeight} = graph.cfg.container;
            const zoom = graph.getZoom();
            const size = {
                x: clientWidth / 2, y: clientHeight / 2
            };
            graph.zoomTo(zoom / 1.2, size);
        }}>
            <Tooltip title={<FormattedMessage id="btn.zoomOut.label"/>}>
                <Icon type='zoom-out'/>
            </Tooltip>
        </div>
        <div className={'tool'} onClick={() => {
            graph.zoomTo(1);
            graph.fitView();
        }}>
            <Tooltip title={<FormattedMessage id="btn.adaptive.label"/>}>
                <Icon type='redo'/>
            </Tooltip>
        </div>
        <div className={'tool'} onClick={() => {
            if (changeCanvasSize || selectNodeToCheck) {
                setChangeCanvasSize(false)
                setSelectNodeToCheck(false)
            } else {
                setChangeCanvasSize(prev => !prev)
            }
        }}>
            <Tooltip
                title={(selectNodeToCheck || changeCanvasSize) ? IntlFormatMessage('datasource.create.back') : IntlFormatMessage('datasource.create.fullScreen')}>
                <Icon type={(selectNodeToCheck || changeCanvasSize) ? 'shrink' : 'arrows-alt'}/>
            </Tooltip>
        </div>
    </PluginWrapper>;
};

export default injectIntl(forwardRef(ToolBar), {
    forwardRef: true
});