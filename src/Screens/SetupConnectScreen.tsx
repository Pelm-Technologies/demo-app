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

import {FlowStep} from "src/Components/FlowStep"

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    setAccessToken: (accessToken: string) => void;
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

    createConnectTokenRequestUrl() {
        return PELM_API_URL + '/auth/connect-token';
    }

    createConnectTokenRequestOptions() {
        const headers = this.headers();
        const data = new URLSearchParams({
            user_id: this.state.userId
        }).toString();
        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };
        return requestOptions;
    }

    createConnectTokenCurl() {
        const curl = fetchToCurl(this.createConnectTokenRequestUrl(), this.createConnectTokenRequestOptions());
        console.log("curl: " + curl)

        return curl
    }

    /*
        We're requeseting the connect_token here for simplicity.
        In an ideal world, you would make this request from your server and then pass the token to your client.
    */
    // generateConnectToken(userId: string) {
    createConnectToken = () => {
        this.setState({ isLoading: true })
        fetch(this.createConnectTokenRequestUrl(), this.createConnectTokenRequestOptions())
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

    createAccessTokenRequestUrl() {
        return PELM_API_URL + '/auth/token';
    }

    createAccessTokenRequestOptions() {
        const headers = this.headers();
        const code = this.state.authorizationCode
            ? this.state.authorizationCode
            : 'AUTHORIZATION_CODE'
        const data = new URLSearchParams({
            grant_type: 'code',
            code
        }).toString();
        const requestOptions = {
            method: 'POST',
            headers,
            body: data,
        };
        return requestOptions;
    }

    createAccessTokenCurl() {
        return fetchToCurl(this.createAccessTokenRequestUrl(), this.createAccessTokenRequestOptions());
    }
    

    /*
        We're requeseting the access_token here for simplicity.
        In an ideal world, you would pass this authorizationCode to your server, which would then:
        1. use the authorizationCode to get an access_token and refresh_token
        2. save the access_token and refresh_token to your db
        3. use the access_token to make requests for a given user's energy data
    */
    // generateAccessToken(authorizationCode: string) {
    createAccessToken = () => {
        this.setState({ isLoading: true })

        // const headers = new Headers();

        // headers.set('Environment', ENVIRONMENT);
        // headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        // headers.set('Pelm-Secret', PELM_SECRET);

        // const data = new FormData();
        // data.append('grant_type', 'code')
        // data.append('code', this.state.authorizationCode!)

        // const requestOptions = {
        //     method: 'POST',
        //     body: data,
        //     headers
        // };

        // fetch(PELM_API_URL + '/auth/token', requestOptions)
        fetch(this.createAccessTokenRequestUrl(), this.createAccessTokenRequestOptions())
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
        const response = this.state.connectToken
            ? this.state.connectToken
            : 'Please click the "CREATE CONNECT TOKEN" button to view response.'

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
                variant="contained"
                onClick={this.createConnectToken}
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
            request={this.createConnectTokenCurl()}
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

        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Now that you've generated a connect_token, you can initialize Connect to connect your Utility credentials. Click the "CONNECT YOUR UTILITY" button below to open the Connect flow.
            <br/>
            <br/>
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
            {/* Or you can click "SKIP CONNECT FLOW" button to simulate going through the Connect Flow as the Sandbox User.
            <br/>
            <br/> */}
        </Typography>

        const children = <Box>
            <ConnectButton config={config} />
        </Box>

        const response = this.state.authorizationCode
            ? this.state.authorizationCode
            : 'Please connect your Utility to view authorizationCode'

        return <FlowStep
            title="2. Connect your Utility"
            description={description}
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

        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Upon successfully completing the Connect flow, you're onSuccess callback is called with the generated <code>authorization_code</code>.
            This code can be used to generate an <code>access_token</code> via <a href='https://docs.pelm.com/reference/post_auth-token-1' target='_blank'>POST /auth/token</a>.
        </Typography>

        const children = <Box>
            <TextField 
                label="authorization_code"
                variant="outlined"  
                value={
                    this.state.authorizationCode
                        ? this.state.authorizationCode
                        : 'missing_authorization_code'
                }
                disabled
                fullWidth
            />
            
            <Button 
                variant="contained"
                onClick={this.createAccessToken}
                color="primary"
            >
                Create access_token
            </Button>
            
        </Box>

        const response = this.state.accessToken
            ? this.state.accessToken
            : 'Please click the "CREATE ACCESS TOKEN" button to view response.'

        return <FlowStep
            title="3. Create Access Token"
            description={description}
            request={this.createAccessTokenCurl()}
            response={response}
            children={children}
        />
    }

    onContinue = () => {
        this.props.setAccessToken(this.state.accessToken!)
    }

    renderSuccessPanel() {
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            You've successfully created an access_token, which allows you to fetch data for the User you just created.
            <br/>
            <br/>
            Click the "CONTINUE" button below to continue to the next page, where you can begin making requests.
        </Typography>

        const children = <Box>
            <Button 
                variant="contained"
                onClick={this.onContinue}
                color="primary"
            >
                Continue
            </Button>
        </Box>

        // const response = this.state.accessToken
        //     ? this.state.accessToken
        //     : 'Please click the "CREATE ACCESS TOKEN" button to view response.'

        return <FlowStep
            title="4. Start making requests"
            description={description}
            request={''}
            response={''}
            children={children}
        />
    }

    render(): React.ReactNode {
        return <Container>
            <Box sx={{ my: 4 }}>
                <div>
                    {this.renderConnectTokenPanel()}
                    {this.renderConnectUtilityPanel()}
                    {this.renderAccessTokenPanel()}
                    {this.renderSuccessPanel()}
                </div>
            </Box>
        </Container>
    }
}