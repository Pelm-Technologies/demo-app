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
import { Endpoint } from "src/Components/Endpoint2";

import { FetchHelper } from 'src/FetchHelper'

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    fetchHelper: FetchHelper;
    clientId: string;
    secret: string;
    connectToken?: string;
    setConnectToken: (connectToken: string) => void;
}

type State = {
    userId: string;
    isLoading: boolean;
    error?: string;
    responseBody?: any;
}

const theme = createTheme();
const userId = uuidv4();

export class ConnectTokenStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            userId: uuidv4(),
            isLoading: false,
            error: undefined,
        }
    }

    onUserIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            userId: value
        })
    }

    createConnectToken = () => {
        this.setState({ isLoading: true })
        this.props.fetchHelper.createConnectToken(this.state.userId)
            .then(responseBody => {
                this.setState({ 
                    isLoading: false,
                    responseBody
                })

                if (responseBody.hasOwnProperty('connect_token')) {
                    this.props.setConnectToken(responseBody['connect_token'])
                    // this.setState({
                    //     responseBody: responseBody
                    // });
                }

                // if (responseBody.hasOwnProperty('error_code')) {
                //     // TODO: display errors in snippet thing
                //     console.log("error")
                //     console.log(responseBody)
                // }
            })
    }

    requestChild() {
        return <CopyBlock
            text={this.props.fetchHelper.createConnectTokenCurl(this.state.userId)}
            language="curl"
            showLineNumbers={false}
            theme={dracula}
            wrapLines
        />
    }

    responseChild() {
        if (this.state.responseBody) {
            return <CopyBlock
                text={JSON.stringify(this.state.responseBody, null, '\t')}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                // wrapLines
            />
        }
    }

    render(): React.ReactNode {
        const response = this.props.connectToken
            ? this.props.connectToken
            : 'Please click the "CREATE CONNECT TOKEN" button to view response.'

        const description = <Box>
            <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
                The first step of initializing Connect is creating a <code>connect_token</code>. 
                We recommend creating this token in your server to abstract away sensitive information like your <code>Pelm-Secret</code> from your frontend.
                <br/>
                <br/>
                The <code>connect_token</code> must be initialized with a <code>user_id</code>. This is a value specified by you for identifying the User.
                We've generated a random <code>user_id</code> in the input field, but feel free to replace it with a different value.
                <br/>
                <br/>
            </Typography>
        </Box>

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

        return <Endpoint 
            title="1. Create Connect Token"
            description={description}
            // request={this.createConnectTokenCurl()}
            request={this.requestChild()}
            response={this.responseChild()}
            children={children}
        />
    }
}