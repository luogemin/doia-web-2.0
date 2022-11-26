import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Error from '@/pages/Error';
import TableList from '@/pages/AlgorithmicGenerics/components/List';
import Create from '@/pages/AlgorithmicGenerics/components/CreateForm';
import Detail from "@/pages/AlgorithmicGenerics/components/Detail";

export default class AlgorithmicGenerics extends Component {
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
                    key={"2"}
                    exact
                    path={`${path}/create/type/:typeId`}
                    component={Create}
                />
                <Route
                    key={"7"}
                    path={`${path}/:storeId(\\d+)`}
                    component={Detail}
                />
                <Route component={Error}/>
            </Switch>
        );
    }
}
