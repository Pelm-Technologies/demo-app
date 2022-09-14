import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'

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

import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ConnectButton } from 'src/connectButton'
import { Config, useConnect } from "react-pelm-connect";

import { ClientCredentialsStep } from "src/Components/SetupConnectScreen/ClientCredentialsStep";
import { ConnectTokenStep } from "src/Components/SetupConnectScreen/ConnectTokenStep";
import { ConnectUtilityStep } from "src/Components/SetupConnectScreen/ConnectUtilityStep";
import { AccessTokenStep } from "src/Components/SetupConnectScreen/AccessTokenStep";
import { ConnectSuccessfulStep } from "src/Components/SetupConnectScreen/ConnectSuccessfulStep";

import { FetchHelper } from "src/FetchHelper";

import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {FlowStep} from "src/Components/FlowStep"

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    fetchHelper: FetchHelper;
    clientId: string;
    secret: string;

    // setAccessToken: (accessToken: string) => void;
    onContinueToRequestDataScreen: (accessToken: string) => void;
    // setClientId: (clientId: string) => void;
    // setSecret: (secret: string) => void;
    setClientCredentials: (clientId: string, secret: string) => void;
}

type State = {
    // pelmClientId: string;
    // pelmSecret: string;
    expandedPanel: PanelName;
    toggleButtonView: ToggleButtonView;

    userId: string;

    // pelmClientIdInputValue?: string;
    // pelmSecretInputValue?: string;

    isLoading: boolean;
    error?: string;
    connectToken?: string;
    authorizationCode?: string;
    accessToken?: string;
}

const theme = createTheme();
const userId = uuidv4();

export class SetupConnectScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            toggleButtonView: 'request',
            expandedPanel: 'CONNECT_TOKEN',
            userId: uuidv4(),

            isLoading: true,
            error: undefined,
            connectToken: undefined,
            // accessToken: undefined,
            accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV__S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'
        }
    }

    // componentDidMount(): void {
    //     this.generateConnectToken(userId)
    // }

    expandPanel = (expandedPanel: PanelName) => () => {
        this.setState({expandedPanel})
    }

    setConnectToken = (connectToken: string) => {
        this.setState({connectToken})
    }

    setAuthorizationCode = (authorizationCode: string) => {
        this.setState({authorizationCode})
    }

    setAccessToken = (accessToken: string) => {
        this.setState({accessToken})
    }

    setSandboxAccessToken = () => {
        this.setState({accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV__S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'})
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

    headers(): Headers {
        const headers = new Headers();
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }


    onSuccess = (authorizationCode: string) => {
        // this.generateAccessToken(authorizationCode)
        this.setState({authorizationCode})
    }

    onExit = () => {
        console.log("exit")
    }

    renderConnectUtilityMessage() {
        // const config: Config = {
        //     connectToken: this.state.connectToken!,
        //     onSuccess: this.onSuccess,
        //     onExit: this.onExit,
        //     environment: ENVIRONMENT,
        // }
        return <Container>
                <Box sx={{ my: 4 }}>
                    {/* <Typography variant="h4" component="h1" gutterBottom>
                        Connect your utility login
                    </Typography> */}

                    {/* <TextField 
                        label="Pelm-Client-Id"
                        variant="outlined"  
                        value={this.state.pelmClientIdInputValue}
                        // onChange={this.onStartDateInputChange}
                        placeholder="Enter Pelm-Client-Id"
                        sx={{marginLeft: '4px'}}
                    />
                    <TextField 
                        label="Pelm-Secret"
                        variant="outlined"  
                        value={this.state.pelmSecretInputValue}
                        // onChange={this.onEndDateInputChange}
                        placeholder="Enter Pelm-Secret"
                        sx={{marginLeft: '4px'}}
                    />

                    <Typography variant="subtitle1" component="h1" gutterBottom>
                        Follow the steps below to walk through the flow of creating a new 
                    </Typography> */}
                    
                    
                </Box>
            </Container>
    }

    onContinue = () => {
        // this.props.setAccessToken(this.state.accessToken!)
        this.props.onContinueToRequestDataScreen(this.state.accessToken!)
    }

    render(): React.ReactNode {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box sx={{ my: 4 }}>
                <div>
                    <ClientCredentialsStep 
                        fetchHelper={this.props.fetchHelper}
                        // setClientId={this.props.setClientId}
                        // setSecret={this.props.setSecret}
                        setClientCredentials={this.props.setClientCredentials}
                    />
                    <ConnectTokenStep 
                        fetchHelper={this.props.fetchHelper}
                        clientId={this.props.clientId}
                        secret={this.props.secret}
                        connectToken={this.state.connectToken} 
                        setConnectToken={this.setConnectToken}
                    />
                    <ConnectUtilityStep 
                        clientId={this.props.clientId}
                        secret={this.props.secret}
                        connectToken={this.state.connectToken!}  
                        authorizationCode={this.state.authorizationCode}
                        setAuthorizationCode={this.setAuthorizationCode}
                    />
                    <AccessTokenStep 
                        fetchHelper={this.props.fetchHelper}
                        clientId={this.props.clientId}
                        secret={this.props.secret}
                        authorizationCode={this.state.authorizationCode}
                        accessToken={this.state.accessToken}
                        setAccessToken={this.setAccessToken}
                    />
                    <ConnectSuccessfulStep
                        accessToken={this.state.accessToken}
                        onContinue={this.onContinue}
                    />
                </div>
            </Box>
        </Box>
        return <Container fixed>
            <Box sx={{ my: 4 }}>
                <div>
                    <ClientCredentialsStep 
                        fetchHelper={this.props.fetchHelper}
                        // setClientId={this.props.setClientId}
                        // setSecret={this.props.setSecret}
                        setClientCredentials={this.props.setClientCredentials}
                    />
                    <ConnectTokenStep 
                        fetchHelper={this.props.fetchHelper}
                        clientId={this.props.clientId}
                        secret={this.props.secret}
                        connectToken={this.state.connectToken} 
                        setConnectToken={this.setConnectToken}
                    />
                    <ConnectUtilityStep 
                        clientId={this.props.clientId}
                        secret={this.props.secret}
                        connectToken={this.state.connectToken!}  
                        authorizationCode={this.state.authorizationCode}
                        setAuthorizationCode={this.setAuthorizationCode}
                    />
                    <AccessTokenStep 
                        fetchHelper={this.props.fetchHelper}
                        clientId={this.props.clientId}
                        secret={this.props.secret}
                        authorizationCode={this.state.authorizationCode}
                        accessToken={this.state.accessToken}
                        setAccessToken={this.setAccessToken}
                    />
                    <ConnectSuccessfulStep
                        accessToken={this.state.accessToken}
                        onContinue={this.onContinue}
                    />
                </div>
            </Box>
        </Container>
    }
}