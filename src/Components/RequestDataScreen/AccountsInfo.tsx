import * as React from "react";

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { SetupStep } from 'src/Components/SetupStep'
import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";
import { FetchHelper } from "src/FetchHelper";

type Props = {
    fetchHelper: FetchHelper;
    onSelectAccount: (account: any) => void;
}

type State = {
    isLoading: boolean;
    accountsData?: any;
}

export class AccountsInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            isLoading: false,
            accountsData: undefined,
            // accountsData: [{ "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, { "id": "ea200000-0000-0000-0000-000000000000", "account_number": "2077345636", "address": "1 FERRY BUILDING SAN FRANCISCO CA 94105", "available_meter_types": ["ELECTRIC"], "usage_unit": "kwh", "ghg_emissions_unit": "kg_co2e" }],
        }
    }

    onSelectAccount = (account: any) => () => {
        this.props.onSelectAccount(account)
    }

    getAccounts = () => {
        this.setState({ isLoading: true })
        this.props.fetchHelper.getAccounts()
            .then(response_body => {
                this.setState({
                    isLoading: false,
                    accountsData: response_body
                });
            })
    }

    renderPrettyView() {
        console.log(this.state.accountsData)

        try {
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
        } catch(e) {
            return;
        }
        
    }

    renderDescription() {
        return <div>
            An Account is the core data model with which usage intervals and bills are associated. If a User has two homes managed under the same utility login, each will correspond to two different Pelm Account objects.
            <br/><br/>
            Click "SEND REQUEST" to make a request to <a href='https://pelm.com/docs/api-reference/accounts/get-accounts' target='_blank'>GET /accounts</a>, which returns all the Accounts for a given User.
            <br/><br/>
            Note the <code>id</code> field in the response. You'll need this to query usage intervals or bills. 
            Clicking the "SELECT" button in pretty view will pre-populate the selected Account's <code>id</code> in the <code>account_id</code> field for the below requests.
        </div>
    }

    children() {
        return <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <LoadingButton 
                variant="contained"
                onClick={this.getAccounts}
                loading={this.state.isLoading}
                color="primary"
            >
                Send request
            </LoadingButton>
        </Box>
    }

    responseChild() {
        if (this.state.accountsData) {
            return <CopyBlock
                text={JSON.stringify(this.state.accountsData, null, '\t')}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                codeBlock
                wrapLines
            />
        }
    }

    request() {
        return <CopyBlock
            text={this.props.fetchHelper.getAccountsCurl()}
            language="bash"
            showLineNumbers={false}
            theme={dracula}
            wrapLongLines
            customStyle={{
                padding: '10px'
            }}
        />
    }

    render() {
        // return this.renderAccountsEndpoint()
        let data;
        let prettyViewChild;

        if (this.state.accountsData) {
            data = this.state.accountsData;
            prettyViewChild = this.renderPrettyView()
        }

        return <SetupStep
            title={'Get Accounts'}
            description={this.renderDescription()}
            requestChild={this.request()}
            responseChild={this.responseChild()}
            children={this.children()}
            prettyViewChild={prettyViewChild}
        />
    }

}
