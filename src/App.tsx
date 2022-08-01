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

import { ConnectButton } from './connectButton'
import { ConnectedContent } from "./connectedContent";
import { Config, useConnect } from "react-pelm-connect";


type State = {

    isLoading: boolean;
    error?: string;
    connectToken?: string;
    accessToken?: string;
}

const theme = createTheme();
const userId = uuidv4();

export class App extends React.Component<{}, State> {

    constructor() {
        super({})

        this.state = {
            isLoading: true,
            error: undefined,
            connectToken: undefined,
            accessToken: undefined,
            // accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTEwMjQ3MTguMTU3OTQ2LCJ1c2VyIjoiYmNhN2Y4ZWQtYzg2Ny00NzRkLTkxY2EtYTJhYmRhYzYxMzE5IiwiY2xpZW50X2lkIjoiZmI2MGZkOTQtZmZlMi00YWY5LWE1NGEtYzQ3NDc3MGQ0M2Y4In0.1bzAvrum9T2fDIesTwWGXKyRH7j6-jBePyhyBV_Bfa3QcmEPKakK0Uat6MTvGUSoxC3yp4uBe8lO5kjfh8AurMmW1FTYJ3uvsrGUGmnFX5rsu7_reX6ZKjraOEYo2sBpBtgl8cou4PfolQvllanMVPU48NR8-y6mv7DlHHW8u_Dp-oRGfxnkbWRzBtctQqAjiY33CNFt8XhvdJULDq5hWDka2UrSJ-8WN01jRRzPvt3WYcIwHnjRqP6_nPyQbmewRpIqlEveNa_lAkxnN8YTXtT7D53_vnelXGDBtnVJBIazpatjIPeYhQcfyRsbOGmQHN48wjeFYSuwK6KupvBSFg'
        }
    }

    componentDidMount(): void {
        this.generateConnectToken(userId)
    }

    /*
        We're requeseting the connect_token here for simplicity.
        In an ideal world, you would make this request from your server and then pass the token to your client.
    */
    generateConnectToken(userId: string) {
        this.setState({ isLoading: true })

        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);

        const data = new FormData();
        // data.append('user_id', USER_ID)
        data.append('user_id', userId)

        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };

        fetch(PELM_API_URL + '/auth/connect-token', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    isLoading: false,
                    connectToken: data['connect_token']
                })
            })
            .catch((error: Error) => {
                try {
                    this.setState({
                        isLoading: false,
                        error: error.message
                    })
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)
                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    /*
        We're requeseting the access_token here for simplicity.
        In an ideal world, you would pass this authorizationCode to your server, which would then:
        1. use the authorizationCode to get an access_token and refresh_token
        2. save the access_token and refresh_token to your db
        3. use the access_token to make requests for a given user's energy data
    */
    generateAccessToken(authorizationCode: string) {
        this.setState({ isLoading: true })

        const headers = new Headers();

        headers.set('Environment', ENVIRONMENT);
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);

        const data = new FormData();
        data.append('grant_type', 'code')
        data.append('code', authorizationCode)

        const requestOptions = {
            method: 'POST',
            body: data,
            headers
        };

        fetch(PELM_API_URL + '/auth/token', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                console.log("access_token")
                console.log(data['access_token'])

                this.setState({
                    isLoading: false,
                    accessToken: data['access_token']
                })
            })
            .catch((error: Error) => {
                try {
                    this.setState({
                        isLoading: false,
                        error: error.message
                    })
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)
                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    onSuccess = (authorizationCode: string) => {
        this.generateAccessToken(authorizationCode)
    }

    onExit = () => {
        console.log("exit")
    }

    renderConnectUtilityMessage() {
        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            environment: ENVIRONMENT,
        }
        return <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Please connect your utility account to get started.
                    </Typography>
                    <Typography variant="subtitle1" component="h1" gutterBottom>
                        If you don't want to use real utility credentials, you can use our <a href="https://pelm.readme.io/reference/sandbox-user" target="_blank"  >Sandbox User</a>.
                        <br/>
                        <br/>
                        Select the utility "Pacific Gas and Electric". On the credentials screen, enter the following credentials:
                        <br/>
                        username: <code>user@pelm.com</code>
                        <br/>
                        password: <code>password</code>
                        <br/>
                        <br/>
                    </Typography>
                    <ConnectButton config={config} />
                </Box>
            </Container>
    }

    render(): React.ReactNode {
        if (this.state.isLoading) {
            return "Loading"
        }

        if (this.state.error) {
            return "Error: " + this.state.error
        }

        const children = this.state.accessToken
            ? <ConnectedContent accessToken={this.state.accessToken!} userId={userId}/>
            : this.renderConnectUtilityMessage()

        return <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    My Energy App
                </Typography>
                </Toolbar>
            </AppBar>
            <main>
                {children}
                
                
            </main>
        </ThemeProvider>

        
    }
}