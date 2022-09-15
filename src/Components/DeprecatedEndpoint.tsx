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

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


type View = 'pretty' | 'data'

type Props = {
    accessToken: string;
}

type State = {
    accountsData?: any;
    view: View;
}

const Outer = styled.div`
    display: flex;
    justify-content: center;

`

const Container = styled.div`
    width: 800px;
`

export class AccountsInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            accountsData: undefined,
            // accountsData: [{ "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, { "id": "ea200000-0000-0000-0000-000000000000", "account_number": "2077345636", "address": "1 FERRY BUILDING SAN FRANCISCO CA 94105", "available_meter_types": ["ELECTRIC"], "usage_unit": "kwh", "ghg_emissions_unit": "kg_co2e" }],
            view: 'pretty',
        }
    }

    onViewChange = (event: any, view: View) => {
        if (view !== null) {
            this.setState({view});

        }
        
    }

    getData = async () => {
        // setIsLoading(true);

        const headers = new Headers({
            'Authorization': 'Bearer ' + this.props.accessToken,
            'Pelm-Client-Id': PELM_CLIENT_ID,
            'Pelm-Secret': PELM_SECRET
        });
        const requestOptions = {
            method: 'GET',
            headers
        };
        const response = await fetch('https://api.pelm.com/accounts', requestOptions);
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

        this.setState({accountsData: data});

        // setTransformedData(props.transformData(data)); // transform data into proper format for each individual product
        // if (data.pdf != null) {
        //   setPdf(data.pdf);
        // }
        // setShowTable(true);
        // setIsLoading(false);
      };

    fetchAccounts = () => {
        const accessToken = this.props.accessToken
        const headers = new Headers();
        headers.set('Environment', ENVIRONMENT);
        headers.set('Authorization', 'Bearer ' + accessToken);
        headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
        headers.set('Pelm-Secret', PELM_SECRET);

        const requestOptions = {
            method: 'GET',
            headers
        };

        const url = 'https://api.pelm.com/accounts'

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
                this.setState({
                    // accountsData: JSON.stringify(data, null, 2)
                    accountsData: data,
                })
            })
            .catch((error: Error) => {
                try {
                    const errorObject = JSON.parse(error.message);
                    console.log(errorObject)

                } catch (e) {
                    console.log("an error occurred")
                }
            });
    }

    renderPrettyView() {
        return <Grid container spacing={1}>
            {this.state.accountsData.map((account: any) => (
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
            ))}
        </Grid>;
    }

    renderDataView() {
        return <div>
            {JSON.stringify(this.state.accountsData)}
        </div>;
    }

    maybeRenderAccountsResponse() {
        if (this.state.accountsData === undefined) {
            return null;
        }

        const data = JSON.stringify(this.state.accountsData)
        // const data = '[ { "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": [ "GAS", "ELECTRIC" ], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, { "id": "ea200000-0000-0000-0000-000000000000", "account_number": "2077345636", "address": "1 FERRY BUILDING SAN FRANCISCO CA 94105", "available_meter_types": [ "ELECTRIC" ], "usage_unit": "kwh", "ghg_emissions_unit": "kg_co2e" } ]';

        const content = this.state.view == 'pretty'
            ? this.renderPrettyView()
            : this.renderDataView();

        return (
            <div>
                {/* This is the response: */}
                {/* <div>
                    <pre>
                        {data}
                    </pre>
                </div> */}
                <ToggleButtonGroup
                value={this.state.view}
                exclusive
                onChange={this.onViewChange}
                aria-label="text alignment"
                >
                    <ToggleButton value="pretty" aria-label="left aligned">
                        Pretty view
                    </ToggleButton>
                    <ToggleButton value="data" aria-label="centered">
                        Data view
                    </ToggleButton>
                </ToggleButtonGroup>
                <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <CardContent sx={{ flexGrow: 1 }}>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '500px'}}>
                                This is the description blasjdofaiwje aoiwefoiaaiowef wefoiwejofwoif
                            </div>
                            <div style={{width: '500px'}}>
                                {content}
                            </div>
                            

                            {/* <div style={{width: '500px'}}>
                                {data}

                            </div>
                            <div style={{width: '500px'}}>
                                <Grid container spacing={1}>
                                    {this.state.accountsData.map((account: any) => (
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
                                    ))}
                                </Grid>

                            </div> */}


                        </div>


                        {/* <Box
                            sx={{
                                width: 300,
                                height: 300,
                                backgroundColor: 'primary.dark',
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                    opacity: [0.9, 0.8, 0.7],
                                },
                            }}
                        >
                            {data}
                        </Box>
                        <Box
                            sx={{
                                width: 300,
                                height: 300,
                                backgroundColor: 'primary.dark',
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                    opacity: [0.9, 0.8, 0.7],
                                },
                            }}
                        >
                            <Grid container spacing={1}>
                                {this.state.accountsData.map((account: any) => (
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
                                ))}
                            </Grid>
                        </Box> */}


                        {/* <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                            {data}
                        </Box>
                        <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                            <Grid container spacing={1}>
                                {this.state.accountsData.map((account: any) => (
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
                                ))}
                            </Grid>
                        </Box> */}


                    </CardContent>
                </Card>
            </div>
        )
    }

    renderAccountsEndpoint() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/accounts</code></div>
                {/* <button onClick={this.fetchAccounts}>Submit</button> */}
                <button onClick={this.getData}>Submit</button>
                {this.maybeRenderAccountsResponse()}
            </div>
        )
    }

    render() {
        return this.renderAccountsEndpoint()
    }

}