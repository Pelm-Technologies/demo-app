import * as React from "react";
import styled from 'styled-components';

import {PELM_API_URL, CLIENT_ID, CLIENT_SECRET, USER_ID, ENVIRONMENT} from './constants'

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
import { EnergyAccountBrowser } from "./energyAccountBrowser";
import { EnergyAccountDetails } from "./energyAccountDetails";

import { EnergyAccount } from './types'


type Props = {
    userId: string;
    accessToken: string;
}

type State = {
    isLoading: boolean;
    energyAccounts: EnergyAccount[]
    selectedEnergyAccount?: EnergyAccount;
    selectedEnergyAccountUsageIntervals?: {};
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();
const POLLING_DELAY = 5000;

export class ConnectedContent extends React.Component<Props, State> {
    interval: NodeJS.Timer | undefined;
    
    constructor(props: Props) {
        super(props)
        this.state = {
            isLoading: true,
            energyAccounts: [],
            selectedEnergyAccount: undefined
        }
    }

    componentDidMount() {
        this.fetchEnergyAccounts()
        this.interval = setInterval(this.fetchEnergyAccounts, POLLING_DELAY)
    }

    componentWillUnmount() {
        clearInterval(this.interval!);
    }

    fetchEnergyAccounts = () => {
        console.log("laowiejawef");
        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('client_id', CLIENT_ID);
        headers.set('client_secret', CLIENT_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = PELM_API_URL + '/accounts'

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                console.log(data);
                const energyAccounts: EnergyAccount[] = [];

                data.forEach((element: any) => {

                    const parsedEnergyAccount = {
                        id: element['id'],
                        accountNumber: element['account_number'],
                        address: element['address'],
                        unit: element['unit']
                    }
                    energyAccounts.push(parsedEnergyAccount)
                });

                this.setState({
                    energyAccounts,
                    isLoading: false
                })
                clearInterval(this.interval!);
            })
            .catch((error: Error) => {
                try {
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)

                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    onEnergyAccountSelect = (selectedEnergyAccount: EnergyAccount) => {
        console.log("selectedEnergyAccount: ")
        console.log(selectedEnergyAccount)
        this.setState({
            selectedEnergyAccount
        })
    }

    clearSelectedEnergyAccount = () => {
        this.setState({
            selectedEnergyAccount: undefined
        })
    }

    renderLoadingContent() {
        return <Box
        sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
        }}
        >
            <Container maxWidth="sm">
                <Typography
                    variant="h4"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Loading accounts
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    This may take a few seconds.
                </Typography>
            </Container>
        </Box>
    }

    render() {
        if (this.state.isLoading) {
            return this.renderLoadingContent()
        }

        return this.state.selectedEnergyAccount
            ? <EnergyAccountDetails 
            energyAccount={this.state.selectedEnergyAccount!} 
            accessToken={this.props.accessToken}
            onBack={this.clearSelectedEnergyAccount}
            />
            : <EnergyAccountBrowser energyAccounts={this.state.energyAccounts} onEnergyAccountSelect={this.onEnergyAccountSelect}/>
    }

}
