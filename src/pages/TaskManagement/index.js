import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Error from '@/pages/Error';
import List from '@/pages/TaskManagement/components/List';
import Create from '@/pages/TaskManagement/components/CreateForm';
import Modify from '@/pages/TaskManagement/components/ModifyForm';
import Detail from "@/pages/TaskManagement/components/Detail";
import { withRouter} from "react-router-dom";

export default withRouter(class TaskManagement extends Component {
    constructor() {
        super();
    }

    render() {
        let {
            match = {},
        } = this.props;

        let {path = ""} = match;
        return (
            <Switch>
                <Route
                    exact
                    key={"1"}
                    path={`${path}/anomaly_detection`}
                    component={List}
                />
                <Route
                    exact
                    key={"1"}
                    path={`${path}/forecasting`}
                    component={List}
                />
                <Route
                    exact
                    key={"2"}
                    path={`${path}/:typeId/create`}
                    component={Create}
                />
                <Route
                    exact
                    key={"3"}
                    path={`${path}/:typeId/modify/:taskId`}
                    component={Modify}
                />
                <Route
                    exact
                    key={"4"}
                    path={`${path}/:typeId/copy/:taskId`}
                    component={Create}
                />
                <Route
                    exact
                    key={"5"}
                    path={`${path}/:typeId/:taskId/:taskVersion/:cycleNumber`}
                    component={Detail}
                />
                <Route component={Error}/>
            </Switch>
        );
    }
});
