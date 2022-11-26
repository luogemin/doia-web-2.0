import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Error from '@/pages/Error';
import list from '@/pages/Setting/components/List';

export default class Setting extends Component {
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
                <Route component={Error}/>
            </Switch>
        );
    }
}
