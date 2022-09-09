import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from '../constants'

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

import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    onContinueToSetupConnectScreen: () => void;
    onContinueToRequestDataScreen: (accessToken: string) => void;
    // setAccessToken: (accessToken: string) => void;
}

type State = {
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


export class WelcomeScreen extends React.Component<Props, State> {

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

    componentDidMount(): void {
        this.generateConnectToken()
    }

    /*
        We're requeseting the connect_token here for simplicity.
        In an ideal world, you would make this request from your server and then pass the token to your client.
    */
// generateConnectToken(userId: string) {
    generateConnectToken = () => {
        this.setState({ isLoading: true })

        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);

        const data = new FormData();
        data.append('user_id', userId)
        // data.append('user_id', this.state.userId)

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
    // generateAccessToken = () => {
        this.setState({ isLoading: true })

        const headers = new Headers();

        headers.set('Environment', ENVIRONMENT);
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);

        const data = new FormData();
        data.append('grant_type', 'code')
        // data.append('code', this.state.authorizationCode!)
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

                this.props.onContinueToRequestDataScreen(data['access_token'])

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
        
        // this.setState({authorizationCode});
        this.generateAccessToken(authorizationCode);
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
                    Welcome to the Pelm Demo App
                </Typography>
                <Typography variant="subtitle1" component="p" gutterBottom>
                    This app is an interactive demo that walks you through the following steps:
                    <ol>
                        <li>Setting up the Connect flow.</li>
                        <li>Creating a new User by connecting a utility account via the Connect flow.</li>
                        <li>Requesting data for the newly created User.</li>
                    </ol>
                    You can skip Connect setup by clicking the "CONNECT UTILITY" button.
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
                
                <Button 
                    variant="contained"
                    onClick={this.props.onContinueToSetupConnectScreen}
                    color="primary"
                >
                    Setup Connect
                </Button>
                <ConnectButton config={config} />
            </Box>
        </Container>
    }
}