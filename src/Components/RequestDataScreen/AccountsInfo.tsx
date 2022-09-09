import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../../constants'
import { requestHeaders } from "../../Helpers/FetchHelpers";

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

import { Endpoint } from 'src/Components/Endpoint'

import fetchToCurl from 'fetch-to-curl';

type View = 'pretty' | 'data'

type Props = {
    accessToken: string;
    onSelectAccount: (account: any) => void;
}

type State = {
    isLoading: boolean;
    accountsData?: any;
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
            isLoading: false,
            accountsData: undefined,
            // accountsData: [{ "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, { "id": "ea200000-0000-0000-0000-000000000000", "account_number": "2077345636", "address": "1 FERRY BUILDING SAN FRANCISCO CA 94105", "available_meter_types": ["ELECTRIC"], "usage_unit": "kwh", "ghg_emissions_unit": "kg_co2e" }],
        }
    }

    // onSelectAccount = (event: { target: any; }) => {
    //     const target = event.target;
    //     const value = target.value;

    //     this.props.onSelectAccount(value);
    // }

    onSelectAccount = (account: any) => () => {
        this.props.onSelectAccount(account)
    }

    requestUrl() {
        return 'https://api.pelm.com/accounts'
    }

    requestOptions(isExample: boolean) {
        // const headers = new Headers({
        //     'Authorization': 'Bearer ' + this.props.accessToken,
        //     'Pelm-Client-Id': PELM_CLIENT_ID,
        //     'Pelm-Secret': PELM_SECRET
        // });

        const headers = requestHeaders(isExample, this.props.accessToken)

        return {
            method: 'GET',
            headers
        };
    }

    getData = async () => {
        // setIsLoading(true);
        this.setState({isLoading: true});

        // const headers = new Headers({
        //     'Authorization': 'Bearer ' + this.props.accessToken,
        //     'Pelm-Client-Id': PELM_CLIENT_ID,
        //     'Pelm-Secret': PELM_SECRET
        // });
        // const requestOptions = {
        //     method: 'GET',
        //     headers
        // };
        
        // const url = 'https://api.pelm.com/accounts'

        const response = await fetch(this.requestUrl(), this.requestOptions(false));
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

        this.setState({
            isLoading: false,
            accountsData: data
        });

        // setTransformedData(props.transformData(data)); // transform data into proper format for each individual product
        // if (data.pdf != null) {
        //   setPdf(data.pdf);
        // }
        // setShowTable(true);
        // setIsLoading(false);
    };

    getCurl() {
        return fetchToCurl(this.requestUrl(), this.requestOptions(true));
    }

    renderPrettyView() {
        console.log(this.state.accountsData)

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
                                Pelm id: {account.id}
                            </Typography>
                            <Typography>
                                Account number: {account.account_number}
                            </Typography>
                            <Typography>
                                Avalailable meter types: {account.available_meter_types.join(", ")}
                            </Typography>
                            <Button 
                                variant="outlined"
                                onClick={this.onSelectAccount(account)}
                                value={account}
                                sx={{marginTop: '8px'}}
                            >
                                SELECT
                            </Button>
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

    renderRequestInfoChild() {
        // return <div>Click this button to make a GET request to <code>/accounts</code></div>;

        return <div>
            Click the "Send Request" button to make a GET request to <code>/accounts</code>.

            <br/>
            <br/>
            The Account object corresponds to an account under a utility login. If a user has a residential home, an investment home, and a vacation home all managed under the same utility login, these would correspond to three different Pelm Account objects.



        </div>
    }

    renderResponseInfoChild() {
        return this.renderSuccessResponseInfoChild()
    }

    renderSuccessResponseInfoChild() {
        return <Box>
            You've successfully fetched this User's Accounts!
            <br/><br/>
            You can now query usage intervals or bills for a specific account by specifying the <code>account_id</code> in requests. 
            Clicking the "SELECT" button in the pretty view will pre-populate that Account's id in other requests.
            <br/><br/>
            <a href="https://docs.pelm.com/reference/get_accounts" target="blank">View docs</a>
        </Box>
    }

    renderCurl() {

    }

    render() {
        // return this.renderAccountsEndpoint()
        let data;
        let prettyViewChild;

        if (this.state.accountsData) {
            data = this.state.accountsData;
            prettyViewChild = this.renderPrettyView()
        }

        return <Endpoint
            isLoading={this.state.isLoading}
            title={'GET /accounts'}
            curl={this.getCurl()}
            requestInfoChild={this.renderRequestInfoChild()}
            responseInfoChild={this.renderResponseInfoChild()}
            onSendRequestClick={this.getData}
            data={data}
            prettyViewChild={prettyViewChild}
            defaultExpanded={true}
        />
    }

}