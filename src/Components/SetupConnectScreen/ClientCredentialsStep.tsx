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
import {SetupStep} from "src/Components/SetupConnectScreen/SetupStep"

import { FetchHelper } from 'src/FetchHelper'

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    fetchHelper: FetchHelper;

    // connectToken?: string;
    // setConnectToken: (connectToken: string) => void;
    // clientId?: string;
    // onClientIdChange: (clientId: string) => void;
    // secret?: string;
    // onSecretChange: (secret: string) => void;
    // setClientId: (clientId: string) => void;
    // setSecret: (secret: string) => void;
    setClientCredentials: (clientId: string, secret: string) => void;
}

type State = {
    clientId?: string;
    secret?: string;

    userId: string;
    isLoading: boolean;
    error?: string;
}

const theme = createTheme();
const userId = uuidv4();

export class ClientCredentialsStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            userId: uuidv4(),
            isLoading: false,
            error: undefined,
        }
    }

    isContinueButtonEnabled() {
        return this.state.clientId && this.state.secret
    }

    onClientIdChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        // this.props.onClientIdChange(value)
        this.setState({clientId: value})
    }

    onSecretChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        // this.props.onSecretChange(value)
        this.setState({secret: value})
    }

    onContinue = () => {
        // this.props.setClientId(this.state.clientId!)
        // this.props.setSecret(this.state.secret!)
        this.props.setClientCredentials(this.state.clientId!, this.state.secret!);
        // this.props.fetchHelper.setClientCredentials(this.state.clientId!, this.state.secret!);
    }

    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="p" gutterBottom sx={{marginTop: '8px'}}>
            Input your client credentials to generate code snippets that work straight out the box. Your credentials can be found in your initial registration email.
            <br/><br/>
            Leave the inputs blank to skip this step.
        </Typography>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TextField 
                label="Pelm-Client-Id"
                variant="outlined"  
                value={this.state.clientId}
                // value={this.props.clientId}
                onChange={this.onClientIdChange}
                placeholder="Enter Pelm-Client-Id"
                sx={{marginTop: '8px'}}
            />
            <TextField 
                label="Pelm-Secret"
                variant="outlined"  
                value={this.state.secret}
                onChange={this.onSecretChange}
                // value={this.props.secret}
                // onChange={this.onSecretChange}
                placeholder="Enter Pelm-Secret"
                sx={{marginTop: '8px'}}
            />
            <Box sx={{
                marginTop: '8px'
            }}>
                <Button 
                    variant="outlined"
                    onClick={this.onContinue}
                    color="primary"
                    disabled={!this.isContinueButtonEnabled()}
                    // sx={{marginTop: '8px'}}
                >
                    Continue
                </Button>
                <Button 
                    variant="outlined"
                    // onClick={this.createAccessToken}
                    color="secondary"
                    sx={{marginLeft: '4px'}}
                >
                    Skip
                </Button>
            </Box>
        </Box>

        return <SetupStep
            title="0. Input Client Credentials (optional)"
            description={description}
            request={''}
            response={''}
            children={children}
        />
    }
}