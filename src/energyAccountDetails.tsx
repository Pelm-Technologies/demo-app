import * as React from "react";
import styled from 'styled-components';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { LineChart, Line, Label } from 'recharts';

import {CLIENT_ID, CLIENT_SECRET, ENVIRONMENT, PELM_API_URL} from './constants'

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

import { EnergyAccount } from './types'

type Props = {
    energyAccount: EnergyAccount;
    accessToken: string;
    onBack: () => void;
}

type State = {
    intervalData?: [];
    billsData?: [];
}

const theme = createTheme();
const POLLING_DELAY = 5000;

export class EnergyAccountDetails extends React.Component<Props, State> {
    interval: NodeJS.Timer | undefined;

    constructor(props: Props) {
        super(props)
        this.state = {
            intervalData: undefined,
            billsData: undefined
        }
    }

    componentDidMount() {
        this.fetchData()
        this.interval = setInterval(this.fetchData, POLLING_DELAY)
    }

    componentWillUnmount() {
        clearInterval(this.interval!);
    }

    fetchData = () => {
        if (this.state.intervalData && this.state.billsData) {
            clearInterval(this.interval!);
        }

        if (!this.state.intervalData) {
            this.fetchIntervals()
        }
        if (!this.state.billsData) {
            this.fetchBills()
        }
    }


    fetchIntervals(startTimeStamp?: string, endTimeStamp?: string) {
        this.setState({
            intervalData: undefined
        })

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

        const url = PELM_API_URL
            + '/intervals?'
            + new URLSearchParams({
                account_id: this.props.energyAccount.id,
                ...(startTimeStamp ? {'startTimeStamp': startTimeStamp} : null),
                ...(endTimeStamp ? {'endTimeStamp': endTimeStamp} : null)
            })

        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error(text) })
                }
            })
            .then((data) => {
                const intervals = data['intervals']
                intervals.forEach((interval: any) => {
                    interval['time'] = new Date(parseInt(interval['start']) * 1000).toISOString();
                })
                this.setState({
                    intervalData: intervals
                })
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

    fetchBills = () => {
        this.setState({
            billsData: undefined
        })

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

        const url = PELM_API_URL + '/accounts/'
            + this.props.energyAccount.id 
            + '/bills'

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

                } catch(e) {
                    console.log("an error occurred")
                }
            });
    }

    renderAccountDetails() {
        return <Card
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h4" component="h2">
                    Account details
                </Typography>
                <Typography>
                Address: {this.props.energyAccount.address}
                </Typography>
                <Typography>
                Account number: {this.props.energyAccount.accountNumber}
                </Typography>
                <Button
                    variant="contained"
                    sx={{'margin-top': '15px'}}
                >
                    Pay bill
                </Button>    
            </CardContent>
        </Card>;
    }

    renderIntervals() {
        const content = !this.state.intervalData
            ? this.renderLoadingContent("intervals")

        : <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            // width={500}
            // height={400}
            data={this.state.intervalData!}
            margin={{
                top: 10,
                right: 30,
                left: 30,
                bottom: 0,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time">
            </XAxis>
            <YAxis>
                <Label
                angle={270}
                position="left"
                style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                }}
                >
                Usage (kWh)
                </Label>
            </YAxis>
            <Tooltip />
            <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" />
            <Brush dataKey='name' height={30} stroke="#8884d8" startIndex={this.state.intervalData!.length - 25}/>
            </AreaChart>
        </ResponsiveContainer>

        return <Card
        sx={{ height: '500px', display: 'flex', flexDirection: 'column' }}
        >
            <Typography align="center" gutterBottom variant="h4" component="h2">
                My usage
            </Typography>
            {content}
        </Card>
    }

    renderBillHistory() {
        const content = !this.state.billsData
            ? this.renderLoadingContent("bills")
            : <Grid container spacing={1}>
            {this.state.billsData!.map((bill: any) => (
                <Grid item key={bill['id']} xs={12}>
                    <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography>
                                Start date: {bill['bill_start_date'] ? new Date(parseInt(bill['bill_start_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
                            </Typography>
                            <Typography>
                                End date: {bill['bill_end_date'] ? new Date(parseInt(bill['bill_end_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
                            </Typography>
                            <Typography>
                                Statement date: {bill['bill_statement_date'] ? new Date(parseInt(bill['bill_statement_date']) * 1000).toISOString().substr(0,10) : 'Unknown'}
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
            ))}
            </Grid>

        return <Card
        sx={{ height: '500px', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h4" component="h2">
                    Bill history
                </Typography>
                {content}
            </CardContent>
        </Card>
    }

    renderLoadingContent(dataType: string) {
        return <Box
        sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
        }}
        >
            <Container maxWidth="sm">
                <Typography
                    variant="h6"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Loading {dataType}
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                    This may take a few minutes if you just connected your utility account for the first time.
                </Typography>
            </Container>
        </Box>
    }

    render() {
        return <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
        >
        
    
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12}>
                    <Button
                        // variant="contained"
                        onClick={() => this.props.onBack()}
                    >
                        Back
                    </Button>

                </Grid>
                <Grid item xs={6}>
                    {this.renderAccountDetails()}
                </Grid>
                <Grid item key='billHistory' xs={6}>
                    {this.renderBillHistory()}
                </Grid>
                <Grid item xs={12}>
                    {this.renderIntervals()}
                    
                </Grid>
             
            </Grid>
            
        </Container>
    </Box>
    }
}