import * as React from "react";

import Box from '@mui/material/Box';

import { ClientCredentialsStep } from "src/Components/SetupConnectScreen/ClientCredentialsStep";
import { ConnectTokenStep } from "src/Components/SetupConnectScreen/ConnectTokenStep";
import { ConnectUtilityStep } from "src/Components/SetupConnectScreen/ConnectUtilityStep";
import { AccessTokenStep } from "src/Components/SetupConnectScreen/AccessTokenStep";
import { ConnectSuccessfulStep } from "src/Components/SetupConnectScreen/ConnectSuccessfulStep";

import { DividerWithMargins } from "src/Components/DividerWithMargins";
import { FetchHelper } from "src/FetchHelper";

type Props = {
    fetchHelper: FetchHelper;
    onContinueToRequestDataScreen: (accessToken: string) => void;
    setClientCredentials: (clientId: string, secret: string) => void;
}

type State = {
    connectToken?: string;
    authorizationCode?: string;
    accessToken?: string;
}

export class SetupConnectScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {}
    }

    setConnectToken = (connectToken: string) => {
        this.setState({connectToken})
    }

    setAuthorizationCode = (authorizationCode: string) => {
        this.setState({authorizationCode})
    }

    setAccessToken = (accessToken: string) => {
        this.setState({accessToken})
    }

    onContinue = () => {
        this.props.onContinueToRequestDataScreen(this.state.accessToken!)
    }

    render(): React.ReactNode {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box sx={{ my: 4 }}>
                    <ClientCredentialsStep 
                        fetchHelper={this.props.fetchHelper}
                        setClientCredentials={this.props.setClientCredentials}
                    />
                    <DividerWithMargins/>
                    <ConnectTokenStep 
                        fetchHelper={this.props.fetchHelper}
                        connectToken={this.state.connectToken} 
                        setConnectToken={this.setConnectToken}
                    />
                    <DividerWithMargins/>
                    <ConnectUtilityStep 
                        connectToken={this.state.connectToken!}  
                        authorizationCode={this.state.authorizationCode}
                        setAuthorizationCode={this.setAuthorizationCode}
                    />
                    <DividerWithMargins/>
                    <AccessTokenStep 
                        fetchHelper={this.props.fetchHelper}
                        authorizationCode={this.state.authorizationCode}
                        setAccessToken={this.setAccessToken}
                    />
                    <DividerWithMargins/>
                    <ConnectSuccessfulStep
                        accessToken={this.state.accessToken}
                        onContinue={this.onContinue}
                    />
                    <Box sx={{height: '200px'}}/>
            </Box>
        </Box>
    }
}