import React, { Component } from 'react';

//创建全局的context对象
const { Provider, Consumer } = React.createContext({
    contentWidth: document.body.clientWidth - 180,
    contentHeight: document.body.clientHeight - 62 - 69
});

export {
    Provider,
    Consumer
};