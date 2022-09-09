import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from './constants'

import { v4 as uuidv4 } from 'uuid';

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { EnergyAccountBrowser } from "./energyAccountBrowser";
import { EnergyAccountDetails } from "./energyAccountDetails";

import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { WelcomeScreen } from "src/WelcomeScreen";
import { ConnectedContent } from "src/connectedContent2";
import { SetupConnectScreen } from "src/SetupConnectScreen";
import { Config, useConnect } from "react-pelm-connect";

import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'
type Step = 'welcome' | 'setup_connect' | 'request_data'


type State = {
    currentStep: Step;

    // pelmClientId: string;
    // pelmSecret: string;
    expandedPanel: PanelName;
    toggleButtonView: ToggleButtonView;

    userId: string;

    pelmClientIdInputValue?: string;
    pelmSecretInputValue?: string;

    isLoading: boolean;
    error?: string;
    connectToken?: string;
    authorizationCode?: string;
    accessToken?: string;
}

const theme = createTheme();
const userId = uuidv4();

export class App extends React.Component<{}, State> {

    constructor() {
        super({})

        this.state = {
            currentStep: 'welcome',
            toggleButtonView: 'request',
            expandedPanel: 'CONNECT_TOKEN',
            userId: uuidv4(),

            isLoading: true,
            error: undefined,
            connectToken: undefined,
            accessToken: undefined,
            // accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV__S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'
        }
    }

    onContinueToSetupConnectScreen = () => {
        this.setState({
            currentStep: 'setup_connect'
        })
    }

    onContinueToRequestDataScreen = (accessToken: string) => {
        this.setState({
            accessToken,
            currentStep: 'request_data'
        })
    }

    // componentDidMount(): void {
    //     this.generateConnectToken(userId)
    // }

    expandPanel = (expandedPanel: PanelName) => () => {
        this.setState({expandedPanel})
    }

    setSandboxAccessToken = () => {
        this.setState({accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV__S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'})
    }

    setAccessToken = (accessToken: string) => {
        this.setState({accessToken})
    }

    onViewChange = (event: any, toggleButtonView: ToggleButtonView) => {
        if (toggleButtonView !== null) {
            this.setState({toggleButtonView});
        }
    }

    onUserIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            userId: value
        })
    }

    render(): React.ReactNode {
        // if (this.state.isLoading) {
        //     return "Loading"
        // }

        // if (this.state.error) {
        //     return "Error: " + this.state.error
        // }

        let children: React.ReactChild;

        const currentStep = this.state.currentStep;

        if (currentStep === 'welcome') {
            children = <WelcomeScreen 
                onContinueToSetupConnectScreen={this.onContinueToSetupConnectScreen}
                onContinueToRequestDataScreen={this.onContinueToRequestDataScreen}
            />
        } else if (currentStep === 'setup_connect') {
            children = <SetupConnectScreen setAccessToken={this.setAccessToken}/>
        } else {
            children = <ConnectedContent accessToken={this.state.accessToken!}/>
        }

        // const children = this.state.accessToken
        //     // ? <ConnectedContent accessToken={this.state.accessToken!} userId={userId}/>
        //     ? <ConnectedContent accessToken={this.state.accessToken!}/>
        //     // : this.renderConnectUtilityMessage()
        //     : <SetupConnectScreen setAccessToken={this.setAccessToken}/>

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