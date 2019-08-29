import React, { Component } from 'react'
import { Font, AppLoading } from 'expo'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Root, StyleProvider } from 'native-base'
import MainApp from './src/App'
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
      'SegoeUIRegular': require('native-base/Fonts/SegoeUIRegular.ttf'),
      'SegoeUIBold': require('native-base/Fonts/SegoeUIBold.ttf'),
      /*'Roboto': require('native-base/Fonts/Roboto.ttf'),*/
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
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
            <MainApp />
          </Root>
        </Provider>
      </StyleProvider>
    );
  }
}