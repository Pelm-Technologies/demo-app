import * as React from "react";

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { WelcomeScreen } from "src/Screens/WelcomeScreen";
import { RequestDataScreen } from "src/Screens/RequestDataScreen";
import { SetupConnectScreen } from "src/Screens/SetupConnectScreen";

import { FetchHelper } from "src/FetchHelper";

import {FlowType} from 'src/types'

type Step = 'welcome' | 'setup_connect' | 'request_data'

type State = {
    currentStepNumber: number;
    flowType: FlowType;
    fetchHelper: FetchHelper;
    currentStep: Step;
}

const theme = createTheme({
    typography: {
      fontFamily: [
        'Open Sans'
      ].join(','),
    }
  });;

export class App extends React.Component<{}, State> {
    constructor() {
        super({})

        this.state = {
            currentStepNumber: 0,
            flowType: 'default',
            fetchHelper: new FetchHelper(),
            currentStep: 'welcome',
            // currentStep: 'setup_connect',
        }
    }

    scrollToTop = () => {
        window.scrollTo(0, 0)
    }

    setFlowType = (flowType: FlowType) => {
        this.setState({flowType})
    }

    onContinue = () => {
        this.setState({
            currentStepNumber: this.state.currentStepNumber + 1
        }, this.scrollToTop)
    }

    onBack = () => {
        this.setState({
            currentStepNumber: this.state.currentStepNumber - 1
        }, this.scrollToTop)
    }

    setClientCredentials = (clientId: string, secret: string) => {
        const clonedFetchHelper = this.state.fetchHelper.clone()
        clonedFetchHelper.setClientCredentials(clientId, secret)
        this.setState({
            fetchHelper: clonedFetchHelper
        })
    }

    setAccessToken = (accessToken: string) => {
        const clonedFetchHelper = this.state.fetchHelper.clone()
        clonedFetchHelper.setAccessToken(accessToken)
        this.setState({
            fetchHelper: clonedFetchHelper
        })
    }

    private flowSteps() {
        return [
            this.renderWelcomeScreen(),
            ...this.maybeRenderSetupConnectScreen(),
            this.renderRequestDataScreen()
        ]
    }

    private renderWelcomeScreen() {
        return <WelcomeScreen
            fetchHelper={this.state.fetchHelper}
            setFlowType={this.setFlowType}
            setAccessToken={this.setAccessToken}
            onContinue={this.onContinue}
        />
    }

    private maybeRenderSetupConnectScreen() {
        return this.state.flowType === 'setup_connect'
            ? [<SetupConnectScreen
                    fetchHelper={this.state.fetchHelper}
                    setClientCredentials={this.setClientCredentials}
                    setAccessToken={this.setAccessToken}
                    onContinue={this.onContinue}
                    onBack={this.onBack}
                />]
            : []
    }

    private renderRequestDataScreen() {
        return <RequestDataScreen
            fetchHelper={this.state.fetchHelper}
            onBack={this.onBack}
        />
    }

    render(): React.ReactNode {
        return <ThemeProvider theme={theme}>
            <CssBaseline />
            {this.flowSteps()[this.state.currentStepNumber]}
        </ThemeProvider>
    }
}
