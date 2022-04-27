import * as React from "react";
import styled from 'styled-components';

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
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { EnergyAccount } from './types'

type Props = {
    energyAccounts: EnergyAccount[];
    onEnergyAccountSelect: (selectedEnergyAccount: EnergyAccount) => void;
}

const theme = createTheme();

export const EnergyAccountBrowser = (props: Props) => {

    const onEnergyAccountSelect = (selectedEnergyAccount: EnergyAccount) => () => {
        props.onEnergyAccountSelect(selectedEnergyAccount)
    }

    return <>
            {/* Hero unit */}
            <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
            }}
            >
                <Container maxWidth="sm">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Energy accounts
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                        Select an energy account to view details
                    </Typography>
                </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={1}>
                {props.energyAccounts.map((account) => (
                    <Grid item key={account.id} xs={12}>
                        <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                {account.address}
                                </Typography>
                                <Typography>
                                Account number: {account.accountNumber}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={onEnergyAccountSelect(account)} >View</Button>
                                <Button size="small">Edit</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </Container>
        </>
}