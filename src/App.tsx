import * as React from "react";

import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { WelcomeScreen } from "src/Screens/WelcomeScreen";
import { ConnectedContent } from "src/Screens/connectedContent2";
import { SetupConnectScreen } from "src/Screens/SetupConnectScreen";

import { FetchHelper } from "src/FetchHelper";

type Step = 'welcome' | 'setup_connect' | 'request_data'

type State = {
    fetchHelper: FetchHelper;
    currentStep: Step;
}

const theme = createTheme();

export class App extends React.Component<{}, State> {
    constructor() {
        super({})

        this.state = {
            fetchHelper: new FetchHelper(),

            currentStep: 'welcome',
            // currentStep: 'setup_connect',
        }
    }

    onContinueToSetupConnectScreen = () => {
        this.setState({
            currentStep: 'setup_connect'
        })
    }

    onContinueToRequestDataScreen = (accessToken: string) => {
        this.setAccessToken(accessToken)
        this.setState({
            currentStep: 'request_data'
        })
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

    render(): React.ReactNode {
        let children: React.ReactChild;

        const currentStep = this.state.currentStep;

        if (currentStep === 'welcome') {
            children = <WelcomeScreen 
                fetchHelper={this.state.fetchHelper}
                onContinueToSetupConnectScreen={this.onContinueToSetupConnectScreen}
                onContinueToRequestDataScreen={this.onContinueToRequestDataScreen}
            />
        } else if (currentStep === 'setup_connect') {
            children = <SetupConnectScreen 
                fetchHelper={this.state.fetchHelper}
                onContinueToRequestDataScreen={this.onContinueToRequestDataScreen}
                setClientCredentials={this.setClientCredentials}
            />
        } else {
            children = <ConnectedContent 
                fetchHelper={this.state.fetchHelper}
            />
        }

        return <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    Pelm Demo
                </Typography>
                </Toolbar>
            </AppBar>
            <main>
                {children}
            </main>
        </ThemeProvider>
    }
}