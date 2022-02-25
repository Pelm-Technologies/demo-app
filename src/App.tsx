import * as React from "react";
import styled from 'styled-components';

import {CLIENT_ID, CLIENT_SECRET, USER_ID, ENVIRONMENT} from './constants'

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

export class App extends React.Component<{}, State> {

    constructor() {
        super({})

        this.state = {
            isLoading: true,
            error: undefined,
            connectToken: undefined,
            accessToken: undefined,
            // accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImV4cCI6MTY0NTc0NzUwMy4wNTgwMDg0LCJ1c2VyIjoiMmQxZGEyMmYtYjhhNi00MTQ3LWI1OGMtMDdlMDIwOGJmOWJmIiwiY2xpZW50X2lkIjoiZmI2M2NhYzAtMGEyNy00YzEwLThkMzUtZmY0NDIzYmZhOGJiIn0.NU9jDHPPoqE7SxsSG8LtZRYjW6HWi_RWGkzxGhUd4D7bSm1LzU1M5c-cvTBwRZhPLsdI7o70j-ZNgJzPSBHIZxDEdvIK254eNk2wSpUrnh9S-BY08WoykSKXjQV9SkK8kszu3CiUkui0WTs0NgWWdI7gVgzk9dFs1vrfqL2A8J-2ycu--oGdVadC9VCjoirh8M6SGTsIvQSj2syQgsvuzf_gGk3taryPywm4LDn4T6cQYcjh5zXdSiyO7rVeEzpzaUenfYxPnPsKfZd3pNua0GSPhym1u9ZIPGYVomaDht4-B3ZPHcdACLPdH_F__1qYvOoyuxaFv98VXzIHWlUnJA'
        }
    }

    componentDidMount(): void {
        this.generateConnectToken()
    }

    /*
        We're requeseting the connect_token here for simplicity.
        In an ideal world, you would make this request from your server and then pass the token to your client.
    */
    generateConnectToken() {
        this.setState({ isLoading: true })

        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const data = new FormData();
        data.append('user_id', USER_ID)

        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };

        fetch('https://api.pelm.com/auth/connect-token', requestOptions)
        // fetch('http://127.0.0.1:5000/auth/connect-token', requestOptions)
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
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const data = new FormData();
        data.append('grant_type', 'code')
        data.append('code', authorizationCode)

        const requestOptions = {
            method: 'POST',
            body: data,
            headers
        };

        fetch('https://api.pelm.com/auth/token', requestOptions)
        // fetch('http://127.0.0.1:5000/auth/token', requestOptions)
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
            ? <ConnectedContent accessToken={this.state.accessToken!} />
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