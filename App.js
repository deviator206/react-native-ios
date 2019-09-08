/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { default as configureStore } from './storage/store/createAppStore';

//screens
import LoginPage from './pages/login/loginPage';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator({
  login: {
    screen: LoginPage,
    key: 'login',
    navigationOptions: () => ({
      header: null
    })
  }
}, {
    initialRouteName: "login",
    mode: 'modal',
    headerMode: 'none',
    initialRouteParams: { someParam: 'Bonjour' }
  });
const AppContainer = createAppContainer(AppNavigator);


// store creation
const newStore = configureStore({});
window.storeInstance = newStore;


class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleNavigationChange = this.handleNavigationChange.bind(this);
  }

  handleNavigationChange(prevState, newState, action) {
    console.log(prevState, newState, action);
  }
  componentDidMount() {
    //  SplashScreen.hide();
  }
  render() {
    return (
      <Provider store={newStore}>
        <AppContainer />
      </Provider>
    );
  }
}
export default App;

