import * as React from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FlowStep } from "src/Components/FlowStep";

type Props = {
    accessToken?: string;
    onContinue: () => void;
}

type State = {
    isLoading: boolean;
    error?: string;
}

export class ConnectSuccessfulStep extends React.Component<Props, State> {

    constructor(props: Props) {
        // super()
        super(props)

        this.state = {
            isLoading: false,
            error: undefined
        }
    }


    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Congrats! You've successfully created an <code>access_token</code>, which allows you to fetch data for the User you just created.
            <br/><br/>
            Click "CONTINUE" to move onto the next screen, where you can view this User's data in rendered format or JSON.
        </Typography>

        const children = <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Button 
                variant="contained"
                onClick={this.props.onContinue}
                color="primary"
                disabled={!this.props.accessToken}
            >
                Continue
            </Button>
        </Box>

        return <FlowStep
            title="4. Request Data"
            description={description}
            requestChild={''}
            responseChild={''}
            children={children}
        />
    }
}