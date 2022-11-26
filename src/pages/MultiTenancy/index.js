import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Error from '@/pages/Error';
import list from '@/pages/MultiTenancy/components/List';
import Create from "@/pages/MultiTenancy/components/CreateForm";
import EditFrom from '@/pages/MultiTenancy/components/Edit';

export default class MultiTenancy extends Component {
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
                    component={list}
                />
                <Route
                    key={"2"}
                    exact
                    path={`${path}/create`}
                    component={Create}
                />
                <Route
                    key={"3"}
                    exact
                    path={`${path}/create/:typeId`}
                    component={Create}
                />
                <Route
                    key={"4"}
                    exact
                    path={`${path}/edit/:typeId`}
                    component={EditFrom}
                />
                <Route component={Error}/>
            </Switch>
        );
    }
}
