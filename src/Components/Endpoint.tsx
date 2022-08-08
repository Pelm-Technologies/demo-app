import * as React from "react";
import styled from 'styled-components';

import { PELM_API_URL, PELM_CLIENT_ID, PELM_SECRET, USER_ID, ENVIRONMENT } from '../constants'

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

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import { EnergyAccount } from './types'

type View = 'pretty' | 'data'

type Props = {
    title: string;

    onSendRequestClick: () => void;

    requestInfoChild: React.ReactChild;
    responseInfoChild: React.ReactChild;
    prettyViewChild?: React.ReactChild;

    data?: any;
}

type State = {
    view: View;
}

const Outer = styled.div`
    display: flex;
    justify-content: center;

`

const Container = styled.div`
    width: 800px;
`

export class Endpoint extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            view: 'pretty',
        }
    }

    onViewChange = (event: any, view: View) => {
        if (view !== null) {
            this.setState({view});
        }
    }

    renderRequestInfo() {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Box sx={{
                width: 800
            }}>
                {this.props.requestInfoChild}
            </Box>
            <Box>
                <Button 
                    variant="outlined"
                    onClick={this.props.onSendRequestClick}
                >
                    Send Request
                </Button>
            </Box>

        </Box>

    }

    renderDataView() {
        return <pre>
            <code>
                {JSON.stringify(this.props.data, null, '\t')}
                {/* {JSON.stringify(this.props.data, null, 2)} */}
            </code>
        </pre>;
    }

    maybeRenderResponseInfo() {
        if (!this.props.data) {
            return null;
        }

        const content = this.state.view == 'pretty'
            ? this.props.prettyViewChild
            : this.renderDataView();

        return (
            <div>
                <Card sx={{ 
                    // height: '100%', 
                    // display: 'flex', 
                    // flexDirection: 'column' 
                    marginTop: '12px',
                }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <div style={{display: 'flex'}}>
                            <Box sx={{
                                width: 350, 
                                height: 500
                            }}>
                                {/* This is the description blasjdofaiwje aoiwefoiaaiowef wefoiwejofwoif */}
                                {this.props.responseInfoChild}
                            </Box>
                            <Box>
                                <Box>
                                    <ToggleButtonGroup
                                        value={this.state.view}
                                        size="small"
                                        exclusive
                                        onChange={this.onViewChange}
                                        aria-label="text alignment"
                                    >
                                        <ToggleButton value="pretty" aria-label="left aligned">
                                            Pretty view
                                        </ToggleButton>
                                        <ToggleButton value="data" aria-label="centered">
                                            Data view
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Box sx={{
                                        width: 650,
                                        height: 500,
                                        overflowY: 'scroll'
                                    }}>
                                        {content}
                                    </Box>
                                </Box>
                            </Box>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Typography variant="h3" gutterBottom component="div">
                    {this.props.title}
                </Typography>
                {this.renderRequestInfo()}
                {this.maybeRenderResponseInfo()}
            </div>
        )
    }
}