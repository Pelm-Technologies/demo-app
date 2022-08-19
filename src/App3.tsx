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

import { ConnectButton } from './connectButton'
// import { ConnectedContent } from "./connectedContent";
import { ConnectedContent } from "./connectedContent2";
import { Config, useConnect } from "react-pelm-connect";

import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {FlowStep} from "./Components/FlowStep"

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

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

export class App extends React.Component<{}, State> {

    constructor() {
        super({})

        this.state = {
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

    // componentDidMount(): void {
    //     this.generateConnectToken(userId)
    // }

    expandPanel = (expandedPanel: PanelName) => () => {
        this.setState({expandedPanel})
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
        // data.append('user_id', USER_ID)
        data.append('user_id', this.state.userId)

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
    // generateAccessToken(authorizationCode: string) {
    generateAccessToken = () => {
        this.setState({ isLoading: true })

        const headers = new Headers();

        headers.set('Environment', ENVIRONMENT);
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);

        const data = new FormData();
        data.append('grant_type', 'code')
        data.append('code', this.state.authorizationCode!)

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

                    <div>
                        {this.renderConnectTokenPanel()}
                        {this.renderConnectUtilityPanel()}
                        {this.renderAccessTokenPanel()}
                    </div>

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

    // TODO: poop
    renderConnectTokenPanel() {

        const headers = new Headers({
            'Pelm-Client-Id': PELM_CLIENT_ID,
            'Pelm-Secret': PELM_SECRET
        });

        const body = new FormData();
        body.append('user_id', this.state.userId)

        const requestOptions = {
            method: 'POST',
            headers,
            body,
        };

        // const curl = fetchToCurl('https://api.pelm.com/auth/connect-token', requestOptions)

        const response = this.state.connectToken
            ? this.state.connectToken
            : 'Please click the "CREATE CONNECT TOKEN" button to view response.'

        const snippet = this.state.toggleButtonView == 'request'
            ? fetchToCurl('https://api.pelm.com/auth/connect-token', requestOptions)
            : response

        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            The first step of initializing Connect is creating a <code>connect_token</code>. 
            We recommend creating this token in your server to abstract away sensitive information like your <code>Pelm-Secret</code> from your frontend.
            <br/>
            <br/>
            The <code>connect_token</code> must be initialized with a <code>user_id</code>. This is a value specified by you for identifying the User.
            We've generated a random <code>user_id</code> in the input field, but feel free to replace it with a different value.
            <br/>
            <br/>
        </Typography>

        const children = <Box>
            <TextField 
                label="user_id"
                variant="outlined"  
                value={this.state.userId}
                onChange={this.onUserIdInputChange}
                // placeholder="Enter Pelm-Client-Id"
                // sx={{marginLeft: '4px'}}
                fullWidth
            />
            
            <Button 
                variant="outlined"
                onClick={this.generateConnectToken}
                color="primary"
                sx={{marginTop: '8px'}}
            >
                Create connect token
            </Button>
            {/* <br/>
            <br/> */}
            
        </Box>

        return <FlowStep
            title="1. Create Connect Token"
            description={description}
            request={fetchToCurl('https://api.pelm.com/auth/connect-token', requestOptions)}
            response={response}
            children={children}
        />
    }

    renderConnectUtilityPanel() {
        const config: Config = {
            connectToken: this.state.connectToken!,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            environment: ENVIRONMENT,
        }

        const successChildren = this.state.authorizationCode
            ? <div>
                <Typography variant="body1" component="p" gutterBottom>
                    Success! Here is the auth_code: {this.state.authorizationCode}
                </Typography>
                <Button 
                    variant="contained"
                    onClick={this.expandPanel('ACCESS_TOKEN')}
                    color="primary"
                >
                    Continue
                </Button>
            </div>
            : null;

        // TODO: show curl

        const children = <Box>
            Now that you've generated a connect_token, you can initialize Connect to connect your Utility.
            You can either use the sandbox credentials or your own blaoiwejf oiweoif jwoief.
            <Typography variant="body1" component="p" gutterBottom>
                Click button to connect
            </Typography>
            <ConnectButton config={config} />
        </Box>

        const response = this.state.authorizationCode
            ? this.state.authorizationCode
            : 'Please connect your Utility to view authorizationCode'

        return <FlowStep
            title="2. Connect your Utility"
            request={'TODO: add react code / javascript code for creating initializing Connect'}
            response={response}
            children={children}
        />
    
    }

    renderAccessTokenPanel() {
        const successChildren = this.state.connectToken
            ? <div>
                <Typography variant="body1" component="p" gutterBottom>
                    Success! Here is the access_token: {this.state.accessToken}
                </Typography>
                {/* <Button 
                    variant="contained"
                    onClick={this.expandPanel(3)}
                    color="primary"
                >
                    Continue
                </Button> */}
            </div>
            : null;

        const children = <Button 
            variant="outlined"
            onClick={this.generateAccessToken}
            color="primary"
        >
            Create access_token
        </Button>

        const response = this.state.accessToken
            ? this.state.accessToken
            : 'Please click the "CREATE ACCESS TOKEN" button to view response.'

        return <FlowStep
            title="3. Create Access Token"
            request={'TODO: add curl for generating access_token'}
            response={response}
            children={children}
        />
    }

    render(): React.ReactNode {
        // if (this.state.isLoading) {
        //     return "Loading"
        // }

        // if (this.state.error) {
        //     return "Error: " + this.state.error
        // }

        const children = this.state.accessToken
            // ? <ConnectedContent accessToken={this.state.accessToken!} userId={userId}/>
            ? <ConnectedContent accessToken={this.state.accessToken!}/>
            : this.renderConnectUtilityMessage()

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