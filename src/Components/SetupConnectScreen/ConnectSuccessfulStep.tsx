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

type Props = {
    accessToken?: string;
    onContinue: () => void;
}

type State = {
    isLoading: boolean;
    error?: string;
}

export class ConnectSuccessfulStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            isLoading: false,
            error: undefined
        }
    }


    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            You've successfully created an access_token, which allows you to fetch data for the User you just created.
            <br/>
            <br/>
            Click the "CONTINUE" button below to continue to the next page, where you can begin making requests.
        </Typography>

        const children = <Box>
            <Button 
                variant="contained"
                onClick={this.props.onContinue}
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
}