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


import {FlowStep} from "src/Components/FlowStep"

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    // setAccessToken: (accessToken: string) => void;
    connectToken: string;
    authorizationCode?: string;
    setAuthorizationCode: (authorizationCode: string) => void;
}

type State = {
    isLoading: boolean;
    error?: string;
}

export class ConnectUtilityStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            isLoading: true,
            error: undefined,
        }
    }


    headers(): Headers {
        const headers = new Headers();
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }

    onSuccess = (authorizationCode: string) => {
        this.props.setAuthorizationCode(authorizationCode)
    }

    onExit = () => {
        console.log("exit")
    }

    render(): React.ReactNode {
        const config: Config = {
            connectToken: this.props.connectToken,
            onSuccess: this.onSuccess,
            onExit: this.onExit,
            environment: ENVIRONMENT,
        }

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

        const response = this.props.authorizationCode
            ? this.props.authorizationCode
            : 'Please connect your Utility to view authorizationCode'

        return <FlowStep
            title="2. Connect your Utility"
            description={description}
            request={'TODO: add react code / javascript code for creating initializing Connect'}
            response={response}
            children={children}
        />
    }
}