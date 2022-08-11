import * as React from "react";
import styled from 'styled-components';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { LineChart, Line, Label } from 'recharts';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'
import { requestHeaders } from "../Helpers/FetchHelpers";

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
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EnergyAccountBrowser } from "../energyAccountBrowser";
import { EnergyAccountDetails } from "../energyAccountDetails";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { EnergyAccount } from '../types'

import { Endpoint } from './Endpoint'

import fetchToCurl from 'fetch-to-curl';


type Props = {
    accessToken: string;

    selectedAccount?: any;
}

type State = {
    isLoading: boolean;
    responseData?: any;
    errorCode?: string;

    accountId: string;
    startDate?: string;
    endDate?: string;
    type: string;
}


export class BillsInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            isLoading: false,
            responseData: undefined,
            accountId: '',
            // accountId: 'ea100000-0000-0000-0000-000000000000',
            type: 'ELECTRIC'
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.selectedAccount !== prevProps.selectedAccount && this.props.selectedAccount) {
            this.setState({accountId: this.props.selectedAccount.id})
        }
    }

    requestUrl() {
        const params = {
            ...(this.state.accountId && { account_id: this.state.accountId })
        }

        return 'https://api.pelm.com/bills?' + new URLSearchParams(params);
    }

    requestOptions(isExample: boolean) {
        const headers = requestHeaders(isExample, this.props.accessToken)

        return {
            method: 'GET',
            headers
        };
    }

    getData = async () => {
        this.setState({isLoading: true});

        const response = await fetch(this.requestUrl(), this.requestOptions(false));

        const data = await response.json();

        this.setState({
            isLoading: false,
            responseData: data
        });
    }

    getCurl() {
        return fetchToCurl(this.requestUrl(), this.requestOptions(true));
    }

    renderPrettyView() {
        const responseData = this.state.responseData!

        // if (!responseData.intervals) {
        //     return;
        // }

        const children: React.ReactChild[] = [];

        // const content = <Grid container spacing={1}>
        //     {this.state.responseData!.map((accountBills: any) => {
        //         accountBills.bills.map((bill: any) => {
        //             children.push(
        //                 <Grid item key={bill['id']} xs={12}>
        //                     <Card
        //                     sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        //                     >
        //                         <CardContent sx={{ flexGrow: 1 }}>
        //                             <Typography>
        //                                 Start date: {bill['start_date'] ? new Date(parseInt(bill['start_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
        //                             </Typography>
        //                             <Typography>
        //                                 End date: {bill['end_date'] ? new Date(parseInt(bill['end_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
        //                             </Typography>
        //                             <Typography>
        //                                 Statement date: {bill['statement_date'] ? new Date(parseInt(bill['statement_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
        //                             </Typography>
        //                             <Typography>
        //                                 Total amount due: {bill['total_amount_due'] ? bill['total_amount_due'] : 'Unknown'}
        //                             </Typography>
        //                             <Typography>
        //                                 Due date: {bill['due_date'] ? new Date(parseInt(bill['due_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
        //                             </Typography>
        //                             {/* <Typography>
        //                             {JSON.stringify(bill)}
        //                             </Typography> */}
        //                         </CardContent>
        //                     </Card>
        //                 </Grid>
        //             )

        //         })


                
        //     })}
        //     </Grid>

        this.state.responseData!.map((accountBills: any) => {
            accountBills.bills.map((bill: any) => {
                children.push(
                    <Grid item key={bill['id']} xs={12}>
                        <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography>
                                    Start date: {bill['start_date'] ? new Date(parseInt(bill['start_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
                                </Typography>
                                <Typography>
                                    End date: {bill['end_date'] ? new Date(parseInt(bill['end_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
                                </Typography>
                                <Typography>
                                    Statement date: {bill['statement_date'] ? new Date(parseInt(bill['statement_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
                                </Typography>
                                <Typography>
                                    Total amount due: {bill['total_amount_due'] ? bill['total_amount_due'] : 'Unknown'}
                                </Typography>
                                <Typography>
                                    Due date: {bill['due_date'] ? new Date(parseInt(bill['due_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
                                </Typography>
                                {/* <Typography>
                                {JSON.stringify(bill)}
                                </Typography> */}
                            </CardContent>
                        </Card>
                    </Grid>
                )
            })
        })

        return <Card
            sx={{ height: '500px', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h4" component="h2">
                    Bill history
                </Typography>
                <Grid container spacing={1}>
                    {children}
                </Grid>
            </CardContent>
        </Card>
    }

    onAccountIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            accountId: value
        })
    }

    renderDataView() {
        return <div>
            {JSON.stringify(this.state.responseData)}
        </div>;
    }

    renderRequestInfoChild() {
        return <Box>
            {this.renderInputs()}

            <Box>
                <br/>
                Input values into the required fields and then click the "SEND REQUEST" button to make a GET request to <code>/intervals</code>
                <br/>
                <br/>
                The <code>account_id</code> field is optional; if omitted, bills for all accounts will be returned. This field specifies the Account object to return intervals for. The <code>account_id</code> is returned in the <code>/accounts</code> response.
                <br/>
                <br/>
            </Box>
        </Box>
    }

    renderInputs() {
        return <Box>
            <TextField 
                label="account_id"
                variant="outlined"  
                value={this.state.accountId}
                onChange={this.onAccountIdInputChange}
                placeholder="Enter Account Id"
            />
        </Box>
    }

    renderResponseInfoChild() {
        return <Box>
            You've successfully fetched the specified Account's bills!
            <br/><br/>
            <a href="https://docs.pelm.com/reference/get_bills" target="blank">View docs</a>
            <br/><br/>
            You can view the a bill pdf by making a request to <a href="https://docs.pelm.com/reference/get_bills-bill-id-pdf" target="blank">{"/bills/<bill_id>/pdf"}</a>.
        </Box>
    }

    render() {
        let data;
        let prettyViewChild;

        if (this.state.responseData) {
            data = this.state.responseData;
            prettyViewChild = this.renderPrettyView()
        }

        return <Endpoint
            isLoading={this.state.isLoading}
            title={'GET /bills'}
            curl={this.getCurl()}
            requestInfoChild={this.renderRequestInfoChild()}
            responseInfoChild={this.renderResponseInfoChild()}
            onSendRequestClick={this.getData}
            data={data}
            prettyViewChild={prettyViewChild}
        />
    }

}