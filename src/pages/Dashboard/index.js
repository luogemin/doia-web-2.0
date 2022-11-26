import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Error from '@/pages/Error';
import List from '@/pages/Dashboard/components/List';
import DetailList from "@/pages/Dashboard/components/DetailList";
import Detail from "@/pages/Dashboard/components/Detail";

export default class Dashboard extends Component {
    constructor(){
        super();
    }

    render() {
        let {
            match={}
        } = this.props;

        let {path = ""} = match;
        return (
            <Switch>
                <Route
                    exact
                    key={"1"}
                    path={`${path}`}
                    component={List}
                />
                <Route
                    key={"2"}
                    exact
                    path={`${path}/detail/type/:typeId`}
                    component={DetailList}
                />
                <Route
                    key={"4"}
                    exact
                    path={`${path}/detail/type/:typeId/detail`}
                    component={Detail}
                />
                <Route component={Error} />
            </Switch>
        );
    }
}
