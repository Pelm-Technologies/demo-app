import * as React from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SetupStep } from "src/Components/SetupStep";
import { FetchHelper } from 'src/FetchHelper'

type Props = {
    fetchHelper: FetchHelper;
    onContinue: () => void;
}

export class ConnectSuccessfulStep extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props)
    }


    render(): React.ReactNode {
        const description = <Typography variant="subtitle1" component="h1" gutterBottom sx={{marginTop: '8px'}}>
            Now that you've generated an <code>access_token</code>, you can fetch data for the User you created.
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
                disabled={!this.props.fetchHelper.accessToken}
            >
                Continue
            </Button>
        </Box>

        return <SetupStep
            title="4. Request Data"
            description={description}
            requestChild={''}
            responseChild={''}
            children={children}
        />
    }
}