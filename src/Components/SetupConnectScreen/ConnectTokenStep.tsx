import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'

import { v4 as uuidv4 } from 'uuid';

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
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
    connectToken?: string;
    setConnectToken: (connectToken: string) => void;
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
    // connectToken?: string;
    authorizationCode?: string;
    accessToken?: string;
}

const theme = createTheme();
const userId = uuidv4();

export class ConnectTokenStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            toggleButtonView: 'request',
            expandedPanel: 'CONNECT_TOKEN',
            userId: uuidv4(),

            isLoading: false,

            error: undefined,
            // connectToken: undefined,
            // accessToken: undefined,
            accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV__S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'
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
                    // connectToken: data['connect_token']
                })
                this.props.setConnectToken(data['connect_token'])
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

    render(): React.ReactNode {
        const response = this.props.connectToken
            ? this.props.connectToken
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
            
            <LoadingButton 
                variant="contained"
                onClick={this.createConnectToken}
                loading={this.state.isLoading}
                // loadingPosition="start"
                color="primary"
                sx={{marginTop: '8px'}}
            >
                Create connect token
            </LoadingButton>
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
}