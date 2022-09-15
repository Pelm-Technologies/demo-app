import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT} from 'src/constants'

import { v4 as uuidv4 } from 'uuid';

import LoadingButton from '@mui/lab/LoadingButton';
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

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    fetchHelper: FetchHelper;
    connectToken?: string;
    setConnectToken: (connectToken: string) => void;
}

type State = {
    userId: string;
    isLoading: boolean;
    responseBody?: any;
}

export class ConnectTokenStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            userId: uuidv4(),
            isLoading: false,
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
                }
            })
    }

    requestChild() {
        return <CopyBlock
            text={this.props.fetchHelper.createConnectTokenCurl(this.state.userId)}
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
        const description = <Box>
            <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
                The first step to initialize Connect is creating a <code>connect_token</code> via <a href='https://docs.pelm.com/reference/post_auth-connect-token' target='_blank'>POST /auth/connect-token</a>. 
                We recommend creating this token in your server to abstract away sensitive information like your <code>Pelm-Secret</code> from your frontend.
                <br/>
                <br/>
                The <code>connect_token</code> must be initialized with a <code>user_id</code>. This is a value specified by you to identify the User; most clients set this as their own database id for the User.
                We've generated a random <code>user_id</code> in the input field, but feel free to replace it with a different value.
                <br/>
                <br/>
            </Typography>
        </Box>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TextField 
                label="user_id"
                variant="outlined"  
                value={this.state.userId}
                onChange={this.onUserIdInputChange}
                fullWidth
            />
            <LoadingButton 
                variant="contained"
                onClick={this.createConnectToken}
                loading={this.state.isLoading}
                color="primary"
                sx={{marginTop: '8px'}}
            >
                Create connect token
            </LoadingButton>
            
        </Box>

        return <Endpoint 
            title="1. Create Connect Token"
            description={description}
            request={this.requestChild()}
            response={this.responseChild()}
            children={children}
        />
    }
}