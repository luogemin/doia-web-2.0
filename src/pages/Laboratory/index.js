import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Error from '@/pages/Error';
import TableList from '@/pages/Laboratory/components/List';
import SingleCheck from './components/SingleCheck';
import RootSingleCheck from './components/RootAnalysis';
import SingleCheckLogAnalysis from './components/LogAnalysis';
import Detail from './components/Detail';
import ConfigureData from './components/ConfigureData';
import EditSource from './components/EditSource';
import EditSourceRootAnalysis from './components/RootAnalysis/EditSourceRootAnalysis';
import RootDetail from './components/RootAnalysis/RootDetail';
import LogAnalysisDetail from './components/LogAnalysis/LogAnalysisDetail';
import LogAnalysisDetailSec from './components/LogAnalysis/LogAnalysisDetailSec';
import EditLogAnalysis from './components/LogAnalysis/EditLogAnalysis';
import LogAnomaly from './components/LogAnomaly';
import LogAnomalyDetail from './components/LogAnomaly/LogAnomalyDetail';
import LogAnomalyDetailSec from './components/LogAnomaly/LogAnomalyDetailSec';
import EditLogAnomaly from './components/LogAnomaly/EditLogAnomaly';

export default class laboratory extends Component {
    constructor() {
        super();
    }

    render() {
        let {
            match = {}
        } = this.props;

        let {path = ""} = match;
        return (
            <Switch>
                <Route
                    exact
                    key={"1"}
                    path={`${path}`}
                    component={TableList}
                />
                <Route
                    exact
                    key={'10'}
                    path={`${path}/log_anomaly_detection/edit/:id`} //日志异常检测编辑
                    component={EditLogAnomaly}
                />
                <Route
                    exact
                    key={'10'}
                    path={`${path}/root_cause_analysis/edit/:id`} //根因编辑
                    component={EditSourceRootAnalysis}
                />
                <Route
                    exact
                    key={'10'}
                    path={`${path}/log_parsing/edit/:id`} //日志模式编辑
                    component={EditLogAnalysis}
                />

                <Route
                    exact
                    key={"2"}
                    path={`${path}/create/root_cause_analysis`}//创建根因分析
                    component={RootSingleCheck}
                />
                <Route
                    exact
                    key={"3"}
                    path={`${path}/create/log_parsing`} //创建日志模式
                    component={SingleCheckLogAnalysis}
                />
                <Route
                    exact
                    key={'14'}
                    path={`${path}/create/log_anomaly_detection`}//创建日志异常检测
                    component={LogAnomaly}
                />

                <Route
                    exact
                    key={"12"}
                    path={`${path}/copy/root_cause_analysis/:taskId`} //复制根因分析
                    component={RootSingleCheck}
                />
                <Route
                    exact
                    key={"12"}
                    path={`${path}/copy/log_parsing/:taskId`}//复制日志模式
                    component={SingleCheckLogAnalysis}
                />
                <Route
                    exact
                    key={"12"}
                    path={`${path}/copy/log_anomaly_detection/:taskId`} //复制日志异常检测
                    component={LogAnomaly}
                />
                <Route
                    exact
                    key={"7"}
                    path={`${path}/root_cause_analysis/:id`}
                    component={RootDetail}
                />
                <Route
                    exact
                    key={"6"}
                    path={`${path}/log_parsing/:id`}//日志模式识别一级页面
                    component={LogAnalysisDetail}
                />
                <Route
                    exact
                    key={"6"}
                    path={`${path}/log_anomaly_detection/:id`} //日志异常检测一级页面
                    component={LogAnomalyDetail}
                />

                <Route
                    exact
                    key={"6"}
                    path={`${path}/log_anomaly_detection/:id/:genericId`} //日志异常检测二级页面
                    component={LogAnomalyDetailSec}
                />
                <Route
                    exact
                    key={"6"}
                    path={`${path}/log_parsing/:id/:genericId`} //日志模式识别二级页面
                    component={LogAnalysisDetailSec}
                />


                <Route
                    exact
                    key={'11'}
                    path={`${path}/:typeId/edit/:id`} //单指标检测和预测的编辑
                    component={EditSource}
                />
                <Route
                    exact
                    key={'8'}
                    path={`${path}/:typeId/original/:id/:tabId`} //只有单指标预测和异常可以配置数据
                    component={ConfigureData}
                />
                <Route
                    exact
                    key={"5"}
                    path={`${path}/create/:sceneId`} //创建单指标检测和预测
                    component={SingleCheck}
                />
                <Route
                    exact
                    key={"9"}
                    path={`${path}/copy/:sceneId/:taskId`} //复制单指标检测和预测
                    component={SingleCheck}
                />
                <Route
                    exact
                    key={"4"}
                    path={`${path}/:typeId/:id`} //单指标检测和预测一级页面
                    component={Detail}
                />
                <Route component={Error}/>
            </Switch>
        );
    }
}
