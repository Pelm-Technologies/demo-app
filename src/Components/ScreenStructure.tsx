import * as React from "react";

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
    title: string
    onBack?: () => void;
}

export class ScreenStructure extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    render(): React.ReactNode {
        const backButton = this.props.onBack
            ? <IconButton 
                onClick={this.props.onBack}
                sx={{
                    color: 'white'
                }}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            : null

        return <Box>
            <AppBar position="relative">
                <Toolbar>
                    {backButton}
                    <Typography variant="h6" color="inherit" noWrap>
                        {this.props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            {this.props.children}
        </Box>
    }
}