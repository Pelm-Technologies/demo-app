import * as React from "react";

import LoadingButton from '@mui/lab/LoadingButton';

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

import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";

import { Endpoint } from 'src/Components/Endpoint2'

import fetchToCurl from 'fetch-to-curl';
import { FetchHelper } from "src/FetchHelper";


type Props = {
    fetchHelper: FetchHelper;
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

    getBills = () => {
        this.setState({ isLoading: true })
        this.props.fetchHelper.getBills(this.state.accountId)
            .then(response_body => {
                this.setState({
                    isLoading: false,
                    responseData: response_body
                });
            })
    }

    renderPrettyView() {
        const responseData = this.state.responseData!

        const children: React.ReactChild[] = [];

        this.state.responseData!.map((accountBills: any) => {
            accountBills.bills.map((bill: any) => {
                children.push(
                    <Grid item key={bill['id']} xs={12}>
                        <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography>
                                    Pelm id: {bill['id']}
                                </Typography>
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

    renderDescription() {
        return <Box>
            Query an Account's bill data.
            <br/><br/>
            Fill out the below fields and then click "SEND REQUEST" to make a request to <a href='https://docs.pelm.com/reference/get_bills' target='_blank'>GET /bills</a>.
            &nbsp;<code>account_id</code> is optional; if omitted, Bills for all accounts will be returned.
            <br/><br/>
            You can view a Bill's pdf via <a href='https://docs.pelm.com/reference/get_bills-bill-id-pdf' target='_blank'>GET /bills/&lt;bill_id&gt;/pdf</a>.
        </Box>
    }

    renderForm() {
        return <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TextField 
                label="account_id"
                variant="outlined"  
                value={this.state.accountId}
                onChange={this.onAccountIdInputChange}
                placeholder="Enter Account Id"
            />
            <LoadingButton 
                variant="contained"
                onClick={this.getBills}
                loading={this.state.isLoading}
                color="primary"
                sx={{marginTop: '8px'}}
            >
                Send request
            </LoadingButton>
        </Box>
    }

    requestChild() {
        return <CopyBlock
            text={this.props.fetchHelper.getBillsCurl(this.state.accountId)}
            language="curl"
            showLineNumbers={false}
            theme={dracula}
            wrapLines
        />
    }

    responseChild() {
        if (this.state.responseData) {
            return <CopyBlock
                text={JSON.stringify(this.state.responseData, null, '\t')}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                codeBlock
                wrapLines
            />
        }
    }

    render() {
        let data;
        let prettyViewChild;

        if (this.state.responseData) {
            data = this.state.responseData;
            prettyViewChild = this.renderPrettyView()
        }

        return <Endpoint
            title={'Get Bills'}
            description={this.renderDescription()}
            requestChild={this.requestChild()}
            responseChild={this.responseChild()}
            prettyViewChild={prettyViewChild}
            children={this.renderForm()}
        />
    }

}