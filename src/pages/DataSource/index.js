import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';

import Error from '@/pages/Error';

import SourceList from '@/pages/DataSource/components/List';
import KakfaSource from './components/KafkaSource/index';
import EditFile from './components/EditFile';
import OffLineSource from './components/offLineSource';
import FileSource from './components/File';
import Detail from './components/Detail';
import NewFileSource from './components/NewFileSource';
import EditOutline from './components/NewFileSource/EditOutline';

export default class DataSource extends Component {
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
                    component={SourceList}
                />
                <Route
                    exact
                    key={"3"}
                    path={`${path}/create/type/outline`}
                    component={OffLineSource}
                />
                <Route
                    exact
                    key={"5"}
                    path={`${path}/create/type/file`}
                    component={NewFileSource}
                />
                <Route
                    exact
                    key={"3"}
                    path={`${path}/create/type/iotdb`}
                    component={OffLineSource}
                />
                {/*<Route*/}
                {/*    exact*/}
                {/*    key={"5"}*/}
                {/*    path={`${path}/create/type/file`}*/}
                {/*    component={FileSource}*/}
                {/*/>*/}

                <Route
                    exact
                    key={"4"}
                    path={`${path}/:sourceId`}
                    component={Detail}
                />
                <Route
                    exact
                    key={"5"}//outline
                    path={`${path}/edit/outline/:id`}
                    component={EditOutline}
                />
                <Route
                    exact
                    key={"7"}
                    path={`${path}/edit/file/:id`}
                    component={EditFile}
                />
                <Route
                    exact
                    key={"2"}
                    path={`${path}/create/type/KAFKA`}
                    component={KakfaSource}
                />
                <Route component={Error}/>
            </Switch>
        );
    }
}
