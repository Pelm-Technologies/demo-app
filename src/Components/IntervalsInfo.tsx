import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'

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
// import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EnergyAccountBrowser } from "../energyAccountBrowser";
import { EnergyAccountDetails } from "../energyAccountDetails";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { EnergyAccount } from '../types'

import { Endpoint } from './Endpoint'

type View = 'pretty' | 'data'

type Props = {
    accessToken: string;
}

type State = {
    response?: any;

    accountId: string;
    startDate?: string;
    endDate?: string;
    type: string;
}

const Outer = styled.div`
    display: flex;
    justify-content: center;

`

const Container = styled.div`
    width: 800px;
`


export class IntervalsInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            response: undefined,

            accountId: 'ea100000-0000-0000-0000-000000000000',
            type: 'ELECTRIC'

            // accountsData: [{ "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, { "id": "ea200000-0000-0000-0000-000000000000", "account_number": "2077345636", "address": "1 FERRY BUILDING SAN FRANCISCO CA 94105", "available_meter_types": ["ELECTRIC"], "usage_unit": "kwh", "ghg_emissions_unit": "kg_co2e" }],
        }
    }

    getData = async () => {
        const headers = new Headers({
            'Authorization': 'Bearer ' + this.props.accessToken,
            'Pelm-Client-Id': PELM_CLIENT_ID,
            'Pelm-Secret': PELM_SECRET
        });

        const requestOptions = {
            method: 'GET',
            headers
        };

        const params = {
            account_id: this.state.accountId,
            type: this.state.type,
            ...(this.state.startDate && {start_date: this.state.startDate}),
            ...(this.state.endDate && {end_date: this.state.endDate})
        }

        const url = 'https://api.pelm.com/intervals?' + new URLSearchParams(params);

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.error != null) {
        //   setError(data.error);
        //   setIsLoading(false);
            console.log("There was an error");
            console.log(data.error)
            return;
        }

        console.log("data");
        console.log(data);

        this.setState({response: data});
    }

    renderPrettyView() {
        return <Grid container spacing={1}>
                Pretty view
            {/* {this.state.accountsData.map((account: any) => (
                <Grid item key={account.id} xs={12}>
                    <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {account.address}
                            </Typography>
                            <Typography>
                                Account number: {account.account_number}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))} */}
        </Grid>;
    }

    onAccountIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            accountId: value
        })
    }

    onTypeInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            type: value
        })
    }

    onStartDateInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            startDate: value
        })
    }

    onEndDateInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            endDate: value
        })
    }

    renderDataView() {
        return <div>
            {JSON.stringify(this.state.response)}
        </div>;
    }

    renderRequestInfoChild() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/intervals</code></div>
                <input
                    id="accountId"
                    name="accoundId"
                    type="text"
                    value={this.state.accountId}
                    onChange={this.onAccountIdInputChange}
                    placeholder="Enter Account Id"
                />
                <input
                    id="startDate"
                    name="startDate"
                    type="text"
                    value={this.state.startDate}
                    onChange={this.onStartDateInputChange}
                    placeholder="Enter Start Date"
                />
                <input
                    id="endDate"
                    name="endDate"
                    type="text"
                    value={this.state.endDate}
                    onChange={this.onEndDateInputChange}
                    placeholder="Enter End Date"
                />
                <select onChange={this.onTypeInputChange}>
                    <option value="ELECTRIC">ELECTRIC</option>
                    <option value="GAS">GAS</option>
                </select>
                {/* <button onClick={this.fetchIntervals}>Submit</button> */}
                {/* {this.maybeRenderIntervalsResponse()} */}
            </div>
        )
    }

    render() {
        // return this.renderAccountsEndpoint()
        let data;
        let prettyViewChild;

        if (this.state.response) {
            data = this.state.response;
            prettyViewChild = this.renderPrettyView()
        }

        return <Endpoint
            title={'Get intervals'}
            requestInfoChild={this.renderRequestInfoChild()}
            onSendRequestClick={this.getData}
            data={data}
            prettyViewChild={prettyViewChild}
        />
    }

}