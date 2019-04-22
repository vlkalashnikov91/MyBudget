import React, { Component } from 'react'
import { Font, AppLoading } from 'expo'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Root } from 'native-base'

import MainApp from './src/App'
import reducers from './src/reducers'
import thunk from 'redux-thunk'

const store = createStore(reducers, applyMiddleware(thunk))

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { 
        loading: true
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({ loading: false });
}

  render() {
    if (this.state.loading) {
      return <AppLoading />;
    }

    return (
        <Provider store={store}>
          <Root>
            <MainApp />
          </Root>
        </Provider>
    );
  }
}