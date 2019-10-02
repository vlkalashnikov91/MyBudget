import React, { Component } from 'react'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Root, StyleProvider } from 'native-base'
import AppContainer from './src/AppContainer'
import reducers from './src/reducers'
import thunk from 'redux-thunk'
import getTheme from './native-base-theme/components'
import platform from './native-base-theme/variables/platform'

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
      'SegoeUIRegular': require('./assets/fonts/SegoeUIRegular.ttf'),
      'SegoeUIBold': require('./assets/fonts/SegoeUIBold.ttf'),
      /*'Roboto': require('native-base/Fonts/Roboto.ttf'),*/
      'Roboto_medium': require('./assets/fonts/Roboto_medium.ttf'),
    });

    this.setState({ loading: false });
}

  render() {
    if (this.state.loading) {
      return <AppLoading />
    }

    return (
      <StyleProvider style={getTheme(platform)}>
        <Provider store={store}>
          <Root>
            <AppContainer />
          </Root>
        </Provider>
      </StyleProvider>
    );
  }
}