import * as React from "react";

import { v4 as uuidv4 } from 'uuid';

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import { SetupStep } from "src/Components/SetupStep";

import { FetchHelper } from 'src/FetchHelper'

type PanelName = 'NONE' | 'CONNECT_TOKEN' | 'CONNECT_UTILITY' | 'ACCESS_TOKEN'
type ToggleButtonView = 'request' | 'response'

type Props = {
    fetchHelper: FetchHelper;
    setClientCredentials: (clientId: string, secret: string) => void;
    onContinue: () => void;
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

    onSubmit = () => {
        this.props.setClientCredentials(this.state.clientId!, this.state.secret!);
        this.props.onContinue();
    }

    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="p" gutterBottom sx={{marginTop: '8px'}}>
            This app provides relevant code snippets to facilitate the Connect integration process. Input your client credentials to generate code snippets that work out of the box. Your credentials can be found in the initial registration email.
            <br/><br/>
            You can also click "SKIP", and we'll generate code snippets with placeholder client credentials.
        </Typography>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TextField 
                label="Pelm-Client-Id"
                variant="outlined"  
                value={this.state.clientId}
                onChange={this.onClientIdChange}
                placeholder="Enter Pelm-Client-Id"
            />
            <TextField 
                label="Pelm-Secret"
                variant="outlined"  
                value={this.state.secret}
                onChange={this.onSecretChange}
                placeholder="Enter Pelm-Secret"
                sx={{marginTop: '8px'}}
            />
            <Box sx={{
                marginTop: '8px',
                display: 'flex',
                flexDirection: 'row'
            }}>
                <Button 
                    variant="contained"
                    onClick={this.onSubmit}
                    color="primary"
                    disabled={!this.isContinueButtonEnabled()}
                    sx={{
                        width: 0,
                        flexGrow: 1
                    }}
                >
                    Submit
                </Button>
                <Button 
                    variant="outlined"
                    color="secondary"
                    onClick={this.props.onContinue}
                    sx={{
                        marginLeft: '4px',
                        width: 0,
                        flexGrow: 1
                    }}
                >
                    Skip
                </Button>
            </Box>
        </Box>

        return <SetupStep 
            title="0. Input Client Credentials (optional)"
            description={description}
            // requestChild={''}
            children={children}
            shouldHidePrettyView
        />
    }
}