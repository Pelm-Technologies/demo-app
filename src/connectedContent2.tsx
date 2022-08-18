import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from './constants'

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
import { EnergyAccountBrowser } from "./energyAccountBrowser";
import { EnergyAccountDetails } from "./energyAccountDetails";

import { EnergyAccount } from './types'


import { AccountsInfo } from './Components/AccountsInfo'
import { IntervalsInfo } from './Components/IntervalsInfo'
import { BillsInfo } from './Components/BillsInfo'

type Props = {
    accessToken: string;
}

type State = {
    selectedAccount?: any;
    accountsData?: any;
    intervalData?: any;
    billsData?: any;
    billDetailsData?: any;
    intervalsAccountIdInput: string;
    intervalsStartDate: string;
    intervalsEndDate: string;
    intervalsType: string;
    billsAccountIdInput: string;
    billIdInput: string;
}

const Outer = styled.div`
    display: flex;
    justify-content: center;

`

const Container = styled.div`
    width: 1000px;
    min-height: 1000px;
`

export class ConnectedContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            
            // selected
            // accountsData: undefined,
            accountsData: [{ "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, { "id": "ea200000-0000-0000-0000-000000000000", "account_number": "2077345636", "address": "1 FERRY BUILDING SAN FRANCISCO CA 94105", "available_meter_types": ["ELECTRIC"], "usage_unit": "kwh", "ghg_emissions_unit": "kg_co2e" }],
            intervalData: undefined,
            billDetailsData: undefined,
            billsData: undefined,
            intervalsAccountIdInput: "",
            intervalsStartDate: "",
            intervalsEndDate: "",
            intervalsType: "ELECTRIC",
            billsAccountIdInput: "",
            billIdInput: "",
        }
    }

    onSelectAccount = (account: any) => {
        this.setState({selectedAccount: account})
    }

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

    fetchIntervals = () => {
        this.setState({
            intervalData: undefined
        })

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

        const url = 'https://api.pelm.com/intervals?' + new URLSearchParams({
            account_id: this.state.intervalsAccountIdInput,
            type: this.state.intervalsType,
            start_date: this.state.intervalsStartDate,
            end_date: this.state.intervalsEndDate
        });

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    intervalData: data
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

    fetchBills = () => {
        this.setState({
            billsData: undefined
        })

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

        const url = 'https://api.pelm.com/accounts/' + this.state.billsAccountIdInput + '/bills'

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    billsData: data
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

    fetchBillDetails = () => {
        this.setState({
            billDetailsData: undefined
        })

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

        const url = 'https://api.pelm.com/bills/' + this.state.billIdInput

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                this.setState({
                    billDetailsData: data
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

    maybeRenderIntervalsResponse() {
        if (this.state.intervalData === undefined) {
            return null;
        }

        const data = this.state.intervalData

        return (
            <div>
                This is the response:
                <div>
                    <pre>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

    maybeRenderAccountBillsResponse() {
        if (this.state.billsData === undefined) {
            return null;
        }

        const data = this.state.billsData

        return (
            <div>
                This is the response:
                <div>
                    <pre>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

    maybeRenderBillDetailsResponse() {
        if (this.state.billDetailsData === undefined) {
            return null;
        }

        const data = this.state.billDetailsData

        return (
            <div>
                This is the response:
                <div>
                    <pre>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

    onBillsInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billsAccountIdInput: value
        })
    }

    renderAccountBillsEndpoint() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/accounts/:account_id/bills</code></div>
                <input
                    id="accountId"
                    name="accoundId"
                    type="text"
                    value={this.state.billsAccountIdInput}
                    onChange={this.onBillsInputChange}
                    placeholder="Enter Account Id"
                />
                <button onClick={this.fetchBills}>Submit</button>
                {this.maybeRenderAccountBillsResponse()}
            </div>
        )
    }

    onBillIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;

        this.setState({
            billIdInput: value
        })
    }

    renderBillDetailsEndpoint() {
        return (
            <div>
                <div>Click this button to make a GET request to <code>/bills/:bill_id</code></div>
                <input
                    id="billId"
                    name="billId"
                    type="text"
                    value={this.state.billIdInput}
                    onChange={this.onBillIdInputChange}
                    placeholder="Enter Bill Id"
                />
                <button onClick={this.fetchBillDetails}>Submit</button>
                {this.maybeRenderBillDetailsResponse()}
            </div>
        )
    }

    render() {
        return (
            <Outer>
                <Container>
                    <br/>
                    <Box>
                        {"[placeholder] access_token info"}
                    </Box>
                    <br/><br/>
                    <AccountsInfo 
                        accessToken={this.props.accessToken}
                        onSelectAccount={this.onSelectAccount}
                    />
                    <br/><br/>
                    <IntervalsInfo 
                        accessToken={this.props.accessToken} 
                        selectedAccount={this.state.selectedAccount}
                    />
                    <br/><br/>
                    <BillsInfo
                        accessToken={this.props.accessToken} 
                        selectedAccount={this.state.selectedAccount}
                    />
                    <br/><br/>
                    <Box>
                        {"[placeholder] more info and link to guides"}
                    </Box>

                    {/* <br />
                    <br />
                    {this.renderAccountBillsEndpoint()}
                    <br />
                    <br />
                    {this.renderBillDetailsEndpoint()} */}
                </Container>
            </Outer>
        )
    }

}