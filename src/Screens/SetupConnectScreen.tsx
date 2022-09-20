import * as React from "react";

import Box from '@mui/material/Box';

import { ClientCredentialsStep } from "src/Components/SetupConnectScreen/ClientCredentialsStep";
import { ConnectTokenStep } from "src/Components/SetupConnectScreen/ConnectTokenStep";
import { ConnectUtilityStep } from "src/Components/SetupConnectScreen/ConnectUtilityStep";
import { AccessTokenStep } from "src/Components/SetupConnectScreen/AccessTokenStep";
import { ConnectSuccessfulStep } from "src/Components/SetupConnectScreen/ConnectSuccessfulStep";

import { DividerWithMargins } from "src/Components/DividerWithMargins";
import { FetchHelper } from "src/FetchHelper";
import { ScreenStructure } from "src/Components/ScreenStructure";

type Props = {
    fetchHelper: FetchHelper;
    setClientCredentials: (clientId: string, secret: string) => void;
    
    setAccessToken: (accessToken: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

type State = {
    connectToken?: string;
    authorizationCode?: string;
}

export class SetupConnectScreen extends React.Component<Props, State> {
    connectTokenStepStart: React.RefObject<HTMLDivElement> = React.createRef();
    connectUtilityStepStart: React.RefObject<HTMLDivElement> = React.createRef();
    accessTokenStepStart: React.RefObject<HTMLDivElement> = React.createRef();
    connectSuccessfulStepStart: React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props: Props) {
        super(props)

        this.state = {}
    }

    setConnectToken = (connectToken: string) => {
        this.setState({connectToken})
    }

    setAuthorizationCode = (authorizationCode: string) => {
        this.setState({authorizationCode})
    }

    executeScroll = (ref: React.RefObject<HTMLDivElement>) => () => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'})
        }
    }

    render(): React.ReactNode {
        const children = <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box sx={{ my: 4 }}>
                <ClientCredentialsStep 
                    fetchHelper={this.props.fetchHelper}
                    setClientCredentials={this.props.setClientCredentials}
                    onContinue={this.executeScroll(this.connectTokenStepStart)}
                />
                <Box ref={this.connectTokenStepStart}>
                    <DividerWithMargins/>
                </Box>
                <ConnectTokenStep 
                    fetchHelper={this.props.fetchHelper}
                    connectToken={this.state.connectToken} 
                    setConnectToken={this.setConnectToken}
                    onContinue={this.executeScroll(this.connectUtilityStepStart)}
                />
                <Box ref={this.connectUtilityStepStart}>
                    <DividerWithMargins/>
                </Box>
                <ConnectUtilityStep 
                    connectToken={this.state.connectToken!}  
                    authorizationCode={this.state.authorizationCode}
                    setAuthorizationCode={this.setAuthorizationCode}
                    onContinue={this.executeScroll(this.accessTokenStepStart)}
                />
                <Box ref={this.accessTokenStepStart}>
                    <DividerWithMargins/>
                </Box>
                <AccessTokenStep 
                    fetchHelper={this.props.fetchHelper}
                    authorizationCode={this.state.authorizationCode}
                    setAccessToken={this.props.setAccessToken}
                    onContinue={this.executeScroll(this.connectSuccessfulStepStart)}
                />
                <Box ref={this.connectSuccessfulStepStart}>
                    <DividerWithMargins/>
                </Box>
                <ConnectSuccessfulStep
                    fetchHelper={this.props.fetchHelper}
                    onContinue={this.props.onContinue}
                />
                <Box sx={{height: '200px'}}/>
            </Box>
        </Box>

        return <ScreenStructure 
            title="Setup Connect"
            children={children}
            onBack={this.props.onBack}
        />
    }
}