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
import { Endpoint } from "src/Components/Endpoint2";

import { FetchHelper } from 'src/FetchHelper'

type Props = {
    fetchHelper: FetchHelper;
    authorizationCode?: string;
    setAccessToken: (accessToken: string) => void;
}

type State = {
    isLoading: boolean;
    responseBody?: any;
}

export class AccessTokenStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            isLoading: false,
        }
    }

    createAccessToken = () => {
        this.setState({ isLoading: true })
        this.props.fetchHelper.createAccessToken(this.props.authorizationCode!)
            .then(responseBody => {
                this.setState({ 
                    isLoading: false,
                    responseBody
                })

                if (responseBody.hasOwnProperty('access_token')) {
                    this.props.setAccessToken(responseBody['access_token'])
                }
            })
    }

    requestChild() {
        return <CopyBlock
            text={this.props.fetchHelper.createAccessTokenCurl(this.props.authorizationCode)}
            language="curl"
            showLineNumbers={false}
            theme={dracula}
        />
    }

    responseChild() {
        if (this.state.responseBody) {
            return <CopyBlock
                text={JSON.stringify(this.state.responseBody, null, '\t')}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                codeBlock
            />
        }
    }

    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Once your User successfully completes the Connect flow, your onSuccess callback is called with an <code>authorizationCode</code>.
            The next step is exchanging this <code>authorizationCode</code> for an <code>access_token</code> via <a href='https://docs.pelm.com/reference/post_auth-token-1' target='_blank'>POST /auth/token</a>.
            We recommend making this request in your backend to avoid exposing the access_token to your frontend.
            <br/><br/>
            We've pre-populated the field below with the authorizationCode generated in the previous step. Click "CREATE ACCESS TOKEN" to continue.
            
        </Typography>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
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
                disabled={!this.props.authorizationCode}
            >
                Create access token
            </LoadingButton>
        </Box>

        return <Endpoint 
            title="3. Create Access Token"
            description={description}
            requestChild={this.requestChild()}
            responseChild={this.responseChild()}
            children={children}
            shouldHidePrettyView
        />
    }
}