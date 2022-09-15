import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'

// import Divider from '@mui/material/Divider';

import { DividerWithMargins } from "src/Components/DividerWithMargins";

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

// import Container from '@mui/material/Container';


import { AccountsInfo } from 'src/Components/RequestDataScreen/AccountsInfo'
import { IntervalsInfo } from 'src/Components/RequestDataScreen/IntervalsInfo'
import { BillsInfo } from 'src/Components/RequestDataScreen/BillsInfo'

import { FetchHelper } from "src/FetchHelper";

type Props = {
    fetchHelper: FetchHelper;
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

            // selectedAccount: { "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" },
            
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

    render() {
        return (
            <Outer>
                <Container>
                    <br/>
                    <AccountsInfo 
                        fetchHelper={this.props.fetchHelper}
                        onSelectAccount={this.onSelectAccount}
                    />
                    <DividerWithMargins/>
                    <IntervalsInfo 
                        fetchHelper={this.props.fetchHelper}
                        selectedAccount={this.state.selectedAccount}
                    />
                    <DividerWithMargins/>
                    <BillsInfo
                        fetchHelper={this.props.fetchHelper}
                        selectedAccount={this.state.selectedAccount}
                    />
                    <Box sx={{height: '200px'}}/>
                </Container>
            </Outer>
        )
    }

}