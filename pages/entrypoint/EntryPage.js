import React, { Component } from 'react';
import { Image, AsyncStorage } from "react-native";
import { Button, Container, Content, Text, View } from 'native-base';
import AuthenticationApi from '../../services/AuthenticationApi';
import { default as commonStyling } from '../common/commonStyling';
import ModalComponent from '../common/modalComponent';
import { default as RBAPolicy } from '../common/rbaPolicy';
import SpinnerComponent from '../common/spinnerComponent';
import styleContent from './EntryPageStyle';
import { default as ApplicationConfiguration } from '../common/application.config';
import LoginPage from '../login/loginPage';


export default class EntryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            userCredentials: undefined
        }
        this.getLoginComponent = this.getLoginComponent.bind(this);
        this.getJustLoaderView = this.getJustLoaderView.bind(this);
        this.getSpinnerComponentView = this.getSpinnerComponentView.bind(this);

        this.onSignInBtnClicked = this.onSignInBtnClicked.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.getUserCredentials = this.getUserCredentials.bind(this);
        this.authenticateApi = new AuthenticationApi();

        this.willFocusSubscription = null;

    }

    componentWillUnmount() {


        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }


    errorHandler(resp) {
        this.setState({
            spinner: false
        });


        // this.props.navigation.navigate('dashboard');
    }
    onSignInBtnClicked(userCredentials) {
        const { userName, password } = userCredentials;
        if (userName && password && userName != "" && password != "") {
            this.setState({
                spinner: true,
            });
            this.authenticateApi.proceedLoginApi({
                params: {
                    userName,
                    password
                },
                successHandler: this.onLoginSuccess,
                errorHandler: this.errorHandler
            });
        }

    }

    onLoginSuccess(data) {
        window.userInformation = data;
        RBAPolicy.init();
        console.log("RESP:", window.userInformation);
        this.setState({
            spinner: false,
        });
        this.props.navigation.navigate('dashboard');
    }



    getLoginComponent() {
        const { userCredentials } = this.state;

        let LoginView;
        if (!userCredentials || !userCredentials.userName || !userCredentials.password) {
            LoginView = (<LoginPage {...this.props} />)
        }
        return LoginView
    }

    getSpinnerComponentView() {
        const { spinner } = this.state;
        const loaderView = (<SpinnerComponent />);
        const nonLoaderView = null;
        if (spinner) {
            return loaderView;
        }
        return nonLoaderView;
    }


    getJustLoaderView() {
        const { userCredentials } = this.state;
        let LoginView;
        if (userCredentials && userCredentials.userName && userCredentials.password) {
            LoginView = (<LoginPage />)
        }
        return LoginView
    }

    async getUserCredentials() {
        let userCredentialStr;
        try {
            userCredentialStr = await AsyncStorage.getItem(ApplicationConfiguration.runtimeConfig.KEY_FOR_USER_CRED);
            this.onSignInBtnClicked(JSON.parse(userCredentialStr));
            this.setState({
                userCredentials: JSON.parse(userCredentialStr)
            });
        } catch (e) {
            this.setState({
                userCredentials: undefined
            });
        }
    }
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.getUserCredentials);
    }

    render() {
        // let logoImg = require('../images/ametek_logo@1X.png');
        return (
            <React.Fragment>
                <Container style={styleContent.container}>
                    <Content padder
                        contentContainerStyle={styleContent.mainContent}
                        style={styleContent.fullWidth}>
                        <View style={styleContent.logoWrapper}>
                            {
                                // <Image source={logoImg} style={styleContent.logo} /> 
                            }
                        </View>
                        <View style={styleContent.loginUpperContent}>
                            <View style={styleContent.loginUpper}>
                                <Text style={styleContent.h1Login}>Insight</Text>
                                <Text style={styleContent.welcomeMsg}>Welcome to AMETEK Insight, one stop shop for all your prospect, leads and market news</Text>
                            </View>

                        </View>
                    </Content>

                </Container>

            </React.Fragment>
        );
    }


}