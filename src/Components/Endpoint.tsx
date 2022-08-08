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

    data?: any;
    prettyViewChild?: React.ReactChild;
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
                width: 600
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
                {/* This is the response: */}
                {/* <div>
                    <pre>
                        {data}
                    </pre>
                </div> */}
                <ToggleButtonGroup
                    value={this.state.view}
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
                <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <CardContent sx={{ flexGrow: 1 }}>
                        <div style={{display: 'flex'}}>
                            <div style={{width: '500px'}}>
                                This is the description blasjdofaiwje aoiwefoiaaiowef wefoiwejofwoif
                            </div>
                            <Box sx={{
                                width: 500,
                                height: 500,
                                overflowY: 'scroll'
                            }}>
                                {content}
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
                {/* {this.props.requestInfoChild}
                <button onClick={this.props.onSendRequestClick}>Submit</button> */}
                {this.maybeRenderResponseInfo()}
            </div>
        )
    }
}