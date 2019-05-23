import React, { Component} from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import {ConfigureStore} from './redux/configureStore';




const store = ConfigureStore();

function listenStore(){
  console.log("Store update!")
  new_state = store.getState()
  console.log(new_state);
}

// store.subscribe(listenStore);


export default class App extends React.Component {


  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
 