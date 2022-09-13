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

import { CopyBlock, dracula } from "react-code-blocks";
import fetchToCurl from 'fetch-to-curl';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {FlowStep} from "src/Components/FlowStep"
import {SetupStep} from "src/Components/SetupConnectScreen/SetupStep"

type Props = {
    clientId: string;
    secret: string;
    authorizationCode?: string;
    accessToken?: string;
    setAccessToken: (accessToken: string) => void;
}

type State = {
    isLoading: boolean;
    error?: string;
}

export class AccessTokenStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            isLoading: false,
            error: undefined
        }
    }

    headers(): Headers {
        const headers = new Headers();
        headers.set('Pelm-Client-Id', this.props.clientId);
        headers.set('Pelm-Secret', this.props.secret);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }

    createAccessTokenRequestUrl() {
        return PELM_API_URL + '/auth/token';
    }

    createAccessTokenRequestOptions() {
        const headers = this.headers();
        const code = this.props.authorizationCode
            ? this.props.authorizationCode
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
                    isLoading: false
                })
                this.props.setAccessToken(data['access_token'])
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
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Upon successfully completing the Connect flow, you're onSuccess callback is called with the generated <code>authorization_code</code>.
            This code can be used to generate an <code>access_token</code> via <a href='https://docs.pelm.com/reference/post_auth-token-1' target='_blank'>POST /auth/token</a>.
        </Typography>

        const children = <Box>
            <TextField 
                label="authorization_code"
                variant="outlined"  
                value={
                    this.props.authorizationCode
                        ? this.props.authorizationCode
                        : 'missing_authorization_code'
                }
                disabled
                fullWidth
            />
            
            <LoadingButton 
                variant="contained"
                onClick={this.createAccessToken}
                loading={this.state.isLoading}
                color="primary"
                sx={{marginTop: '8px'}}
            >
                Create access_token
            </LoadingButton>
        </Box>

        const response = this.props.accessToken
            ? this.props.accessToken
            : 'Please click the "CREATE ACCESS TOKEN" button to view response.'

        return <SetupStep
            title="3. Create Access Token"
            description={description}
            request={this.createAccessTokenCurl()}
            response={response}
            children={children}
        />
    }
}