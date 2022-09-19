import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'

import { v4 as uuidv4 } from 'uuid';

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FetchHelper } from "src/FetchHelper";

import { ConnectButton } from 'src/connectButton'
import { Config, useConnect } from "react-pelm-connect";

type Props = {
    fetchHelper: FetchHelper;
    onContinueToSetupConnectScreen: () => void;
    onContinueToRequestDataScreen: (accessToken: string) => void;
}

type State = {
    userId: string;
    connectToken?: string;
}

const theme = createTheme();
const userId = uuidv4();


export class WelcomeScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            userId: uuidv4()
        }
    }

    componentDidMount(): void {
        this.createConnectToken()
    }

    createConnectToken = () => {
        this.props.fetchHelper.createConnectToken(this.state.userId)
            .then(response_json => {
                if (response_json.hasOwnProperty('connect_token')) {
                    this.setState({
                        connectToken: response_json['connect_token']
                    })
                }

                if (response_json.hasOwnProperty('error_code')) {
                    // TODO: display errors in snippet thing
                    console.log("error while creating connect_token")
                    console.log(response_json)
                }
            })
    }

    createAccessToken = (authorizationCode: string) => {
        this.props.fetchHelper.createAccessToken(authorizationCode)
            .then(response_body => {
                if (response_body.hasOwnProperty('access_token')) {
                    this.props.onContinueToRequestDataScreen(response_body['access_token'])
                    // this.props.setAccessToken(response_body['access_token'])
                }

                if (response_body.hasOwnProperty('error_code')) {
                    // TODO: display errors in snippet thing
                    console.log("error while creating access_token")
                    console.log(response_body)
                }
            })
    }

    onSuccess = (authorizationCode: string) => {
        this.createAccessToken(authorizationCode)
    }

    onExit = () => {
        console.log("exit")
    }

    render(): React.ReactNode {
        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            environment: ENVIRONMENT,
        }

        return <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Test test test test - Welcome to the Pelm Demo App
                </Typography>
                <Typography variant="subtitle1" component="p" gutterBottom>
                    This app allows you to quickly connect a utility account and pull real data.
                    Click "CONNECT YOUR UTILITY" get started.
                    <br/><br/>
                    If you don't want to use real utility credentials, you can use our <a href="https://pelm.readme.io/reference/sandbox-user" target="_blank"  >Sandbox User</a>.
                    Select the utility "Pacific Gas and Electric", and use the following credentials:
                    <br/>
                    &emsp;username: <code>user@pelm.com</code>
                    <br/>
                    &emsp;password: <code>password</code>
                    <br/><br/>
                    We've also provided an extended flow that walks you through the setup of Connect. 
                    This might be useful if you're a developer integrating Pelm - click the the "SETUP CONNECT" button to get started.
                    <br/><br/>
                     {/* TODO: sandbox user instructions */}
                    {/* <br/><br/>
                    If you don't want to use real utility credentials, you can use our <a href="https://pelm.readme.io/reference/sandbox-user" target="_blank"  >Sandbox User</a>.
                    <br/><br/>
                    Select the utility "Pacific Gas and Electric". On the credentials screen, enter the following credentials:
                    <br/>
                    &emsp;username: <code>user@pelm.com</code>
                    <br/>
                    &emsp;password: <code>password</code> */}
                </Typography>
                <ConnectButton config={config} />
                <Button 
                    variant="outlined"
                    onClick={this.props.onContinueToSetupConnectScreen}
                    color="secondary"
                    sx={{
                        marginLeft: '8px'
                    }}
                >
                    Setup Connect
                </Button>
                
            </Box>
        </Container>
    }
}