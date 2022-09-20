import * as React from "react";

import { DividerWithMargins } from "src/Components/DividerWithMargins";

import Box from '@mui/material/Box';
import { AccountsInfo } from 'src/Components/RequestDataScreen/AccountsInfo'
import { IntervalsInfo } from 'src/Components/RequestDataScreen/IntervalsInfo'
import { BillsInfo } from 'src/Components/RequestDataScreen/BillsInfo'

import { FetchHelper } from "src/FetchHelper";

type Props = {
    fetchHelper: FetchHelper;
}

type State = {
    selectedAccount?: any;

}

export class RequestDataScreen extends React.Component<Props, State> {
    intervalsStepStart: React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props: Props) {
        super(props)
        this.state = {
            // selectedAccount: { "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" },
        }
    }

    onSelectAccount = (account: any) => {
        this.setState({selectedAccount: account}, this.executeScroll(this.intervalsStepStart))
    }

    executeScroll = (ref: React.RefObject<HTMLDivElement>) => () => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'})
        }
    }

    render() {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box sx={{ my: 4 }}>
                <AccountsInfo 
                    fetchHelper={this.props.fetchHelper}
                    onSelectAccount={this.onSelectAccount}
                />
                <Box ref={this.intervalsStepStart}>
                    <DividerWithMargins/>
                </Box>
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
            </Box>
        </Box>
    }

}