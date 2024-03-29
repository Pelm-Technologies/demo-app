import * as React from "react";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { LineChart, Line, Label } from 'recharts';

import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";
import { SetupStep } from 'src/Components/SetupStep'
import { FetchHelper } from "src/FetchHelper";


type Props = {
    fetchHelper: FetchHelper;
    selectedAccount?: any;
}

type State = {
    isLoading: boolean;
    responseData?: any;
    errorCode?: string;

    accountId: string;
    meterId: string;
    startDate?: string;
    endDate?: string;
    type: string;
}


export class IntervalsInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            isLoading: false,
            responseData: undefined,
            
            accountId: '',
            meterId: '',
            // accountId: 'ea100000-0000-0000-0000-000000000000',
            type: ''
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.selectedAccount !== prevProps.selectedAccount 
                && this.props.selectedAccount
        ) {
            this.setState({accountId: this.props.selectedAccount.id})
        }
    }

    getIntervals = () => {
        this.setState({ isLoading: true })
        this.props.fetchHelper.getIntervals(
            this.state.accountId, this.state.meterId, this.state.type, this.state.startDate, this.state.endDate
        )
            .then(response_body => {
                this.setState({
                    isLoading: false,
                    responseData: response_body
                });
            })
    }

    onAccountIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            accountId: value
        })
    }

    onMeterIdInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            meterId: value
        })
    }

    onTypeInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            type: value
        })
    }

    onStartDateInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            startDate: value
        })
    }

    onEndDateInputChange = (event: { target: any; }) => {
        const target = event.target;
        const value = target.value;
        this.setState({
            endDate: value
        })
    }

    renderPrettyView() {
        const responseData = this.state.responseData!

        if (!responseData.intervals) {
            return;
        }

        let chartData: any[] = [];
        responseData.intervals.forEach((interval: any) => {
            chartData.push({
                time: new Date(parseInt(interval.start) * 1000).toISOString(),
                usage: interval.usage
            })
        });


        const content = <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time">
                    </XAxis>
                    <YAxis>
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                            }}
                        >
                            Usage (kWh)
                        </Label>
                    </YAxis>
                    <Tooltip />
                    <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" />
                    <Brush dataKey='name' height={30} stroke="#8884d8" startIndex={chartData.length - 25} />
                </AreaChart>
            </ResponsiveContainer>

        return <Card
            sx={{ height: '500px', display: 'flex', flexDirection: 'column' }}
        >
            <Typography align="center" gutterBottom variant="h4" component="h2">
                My usage
            </Typography>
            {content}
        </Card>
    }

    renderDescription() {
        return <Box>
            Query an Account's electricity or gas usage intervals, down to fifteen minute granularity.
            <br/><br/>
            Fill out the fields below and click "SEND REQUEST" to make a request to <a href='https://pelm.com/docs/api-reference/usage/get-usage-intervals' target='_blank'>GET /intervals</a>.
            &nbsp;Either the <code>account_id</code> and a specific meter type or a specific <code>meter_id</code> is required; both are returned in the <code>GET /accounts</code> response.
            &nbsp;<code>The start_date</code> and <code>end_date</code> parameters are optional and accept UNIX timestamps, which you can generate <a href='https://www.epochconverter.com/' target='_blank'>here</a>.
        </Box>
    }

    renderForm() {
        return <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <TextField 
                label="account_id"
                variant="outlined"  
                value={this.state.accountId}
                onChange={this.onAccountIdInputChange}
                placeholder="Enter account_id"
            />
            <TextField 
                label="meter_id"
                variant="outlined"  
                value={this.state.meterId}
                onChange={this.onMeterIdInputChange}
                placeholder="Enter meter_id"
                sx={{
                    marginTop: '8px'
                }}
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '8px'
            }}>
                <TextField 
                    label="start_date"
                    variant="outlined"  
                    value={this.state.startDate}
                    onChange={this.onStartDateInputChange}
                    placeholder="Enter start_date"
                    // sx={{marginTop: '8px'}}
                />
                <TextField 
                    label="end_date"
                    variant="outlined"  
                    value={this.state.endDate}
                    onChange={this.onEndDateInputChange}
                    placeholder="Enter end_date"
                    sx={{marginLeft: '8px'}}
                />

            </Box>
            
            <FormControl 
                sx={{marginTop: '8px'}}
            >
                <InputLabel id="demo-simple-select-label">type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.type}
                    label="type"
                    onChange={this.onTypeInputChange}
                >
                <MenuItem value=""></MenuItem>
                <MenuItem value="ELECTRIC">ELECTRIC</MenuItem>
                <MenuItem value="GAS">GAS</MenuItem>
                </Select>
            </FormControl>
            <LoadingButton 
                variant="contained"
                onClick={this.getIntervals}
                loading={this.state.isLoading}
                color="primary"
                sx={{marginTop: '8px'}}
            >
                Send request
            </LoadingButton>
        </Box>
    }

    requestChild() {
        return <CopyBlock
            text={this.props.fetchHelper.getIntervalsCurl(
                this.state.accountId, this.state.meterId, this.state.type, this.state.startDate, this.state.endDate
            )}
            language="bash"
            showLineNumbers={false}
            theme={dracula}
            wrapLines
            customStyle={{
                padding: '10px'
            }}
        />
    }

    responseChild() {
        if (this.state.responseData) {
            return <CopyBlock
                text={JSON.stringify(this.state.responseData, null, '\t')}
                language="json"
                showLineNumbers={true}
                theme={dracula}
                codeBlock
                wrapLines
            />
        }
    }

    render() {
        let data;
        let prettyViewChild;

        if (this.state.responseData) {
            data = this.state.responseData;
            prettyViewChild = this.renderPrettyView()
        }

        return <SetupStep
            title={'Get Intervals'}
            description={this.renderDescription()}
            requestChild={this.requestChild()}
            responseChild={this.responseChild()}
            prettyViewChild={prettyViewChild}
            children={this.renderForm()}
        />
    }

}

// responseData: { "utility": "Pacific Gas and Electric", "type": "ELECTRIC", "account": { "id": "ea100000-0000-0000-0000-000000000000", "account_number": "1077345636", "address": "1 WARRIORS WAY SAN FRANCISCO CA 94158", "available_meter_types": ["GAS", "ELECTRIC"], "usage_unit": "kwh", "gas_usage_unit": "therm", "ghg_emissions_unit": "kg_co2e" }, "intervals": [{ "start": 1654646400, "end": 1654650000, "usage": 4.8628, "ghg_emissions": 0.5951260218305533 }, { "start": 1654650000, "end": 1654653600, "usage": 2.161, "ghg_emissions": 0.40694951786727174 }, { "start": 1654653600, "end": 1654657200, "usage": 0.5377, "ghg_emissions": 0.1510732352820681 }, { "start": 1654657200, "end": 1654660800, "usage": 0.6109, "ghg_emissions": 0.17528812980358666 }, { "start": 1654660800, "end": 1654664400, "usage": 0.7115, "ghg_emissions": 0.20178052528639284 }, { "start": 1654664400, "end": 1654668000, "usage": 0.6086, "ghg_emissions": 0.173838645733561 }, { "start": 1654668000, "end": 1654671600, "usage": 0.3878, "ghg_emissions": 0.11107447777182645 }, { "start": 1654671600, "end": 1654675200, "usage": 0.2881, "ghg_emissions": 0.08069199356456727 }, { "start": 1654675200, "end": 1654678800, "usage": 0.321, "ghg_emissions": 0.09254833807236003 }, { "start": 1654678800, "end": 1654682400, "usage": 0.2789, "ghg_emissions": 0.0819460032215846 }, { "start": 1654682400, "end": 1654686000, "usage": 0.255, "ghg_emissions": 0.07449350250690678 }, { "start": 1654686000, "end": 1654689600, "usage": 0.3099, "ghg_emissions": 0.08816475912856706 }, { "start": 1654689600, "end": 1654693200, "usage": 0.2121, "ghg_emissions": 0.06374237637362638 }, { "start": 1654693200, "end": 1654696800, "usage": 0.2728, "ghg_emissions": 0.08815709250698037 }, { "start": 1654696800, "end": 1654700400, "usage": 0.2875, "ghg_emissions": 0.08862836613426608 }, { "start": 1654700400, "end": 1654704000, "usage": 0.311, "ghg_emissions": 0.07041022449064276 }, { "start": 1654704000, "end": 1654707600, "usage": 1.4416, "ghg_emissions": 0.22831800393061608 }, { "start": 1654707600, "end": 1654711200, "usage": 4.1616, "ghg_emissions": 0.39908599437233366 }, { "start": 1654711200, "end": 1654714800, "usage": 3.5384, "ghg_emissions": 0.4127153477332068 }, { "start": 1654714800, "end": 1654718400, "usage": 3.4145, "ghg_emissions": 0.41017797237296494 }, { "start": 1654718400, "end": 1654722000, "usage": 3.6763, "ghg_emissions": 0.37337568090413886 }, { "start": 1654722000, "end": 1654725600, "usage": 2.998, "ghg_emissions": 0.29805950653120467 }, { "start": 1654725600, "end": 1654729200, "usage": 2.4943, "ghg_emissions": 0.2513846385385853 }, { "start": 1654729200, "end": 1654732800, "usage": 2.5264, "ghg_emissions": 0.2604135384615385 }, { "start": 1654732800, "end": 1654736400, "usage": 4.288, "ghg_emissions": 0.5415098376668682 }, { "start": 1654736400, "end": 1654740000, "usage": 1.1958, "ghg_emissions": 0.2618769091847265 }, { "start": 1654740000, "end": 1654743600, "usage": 4.5896, "ghg_emissions": 1.2589171497093614 }, { "start": 1654743600, "end": 1654747200, "usage": 3.7181, "ghg_emissions": 1.0733488666640925 }, { "start": 1654747200, "end": 1654750800, "usage": 2.4975, "ghg_emissions": 0.732316787218822 }, { "start": 1654750800, "end": 1654754400, "usage": 2.4994, "ghg_emissions": 0.6839174869283758 }, { "start": 1654754400, "end": 1654758000, "usage": 1.6409, "ghg_emissions": 0.4613146942931775 }, { "start": 1654758000, "end": 1654761600, "usage": 1.4024, "ghg_emissions": 0.39640411315926644 }, { "start": 1654761600, "end": 1654765200, "usage": 1.3991, "ghg_emissions": 0.4056147971945657 }, { "start": 1654765200, "end": 1654768800, "usage": 1.4576, "ghg_emissions": 0.41655208470540556 }, { "start": 1654768800, "end": 1654772400, "usage": 1.4433, "ghg_emissions": 0.4240856834643243 }, { "start": 1654772400, "end": 1654776000, "usage": 1.4274, "ghg_emissions": 0.41534940397350995 }, { "start": 1654776000, "end": 1654779600, "usage": 1.3965, "ghg_emissions": 0.3959634853743183 }, { "start": 1654779600, "end": 1654783200, "usage": 1.4072, "ghg_emissions": 0.3940965338994785 }, { "start": 1654783200, "end": 1654786800, "usage": 1.4561, "ghg_emissions": 0.4284537932498408 }, { "start": 1654786800, "end": 1654790400, "usage": 1.4141, "ghg_emissions": 0.337428881754503 }, { "start": 1654790400, "end": 1654794000, "usage": 2.5572, "ghg_emissions": 0.447215565977944 }, { "start": 1654794000, "end": 1654797600, "usage": 3.8183, "ghg_emissions": 0.5081940098815093 }, { "start": 1654797600, "end": 1654801200, "usage": 3.7675, "ghg_emissions": 0.46577882823508027 }, { "start": 1654801200, "end": 1654804800, "usage": 3.5328, "ghg_emissions": 0.3982856126223138 }, { "start": 1654804800, "end": 1654808400, "usage": 3.7696, "ghg_emissions": 0.425376210771019 }, { "start": 1654808400, "end": 1654812000, "usage": 1.9996, "ghg_emissions": 0.21537955511616413 }, { "start": 1654812000, "end": 1654815600, "usage": 2.0976, "ghg_emissions": 0.22008591319804474 }, { "start": 1654815600, "end": 1654819200, "usage": 1.7401, "ghg_emissions": 0.15752430979366464 }, { "start": 1654819200, "end": 1654822800, "usage": 2.1748, "ghg_emissions": 0.2172988337652721 }, { "start": 1654822800, "end": 1654826400, "usage": 1.4139, "ghg_emissions": 0.3104608187640644 }, { "start": 1654826400, "end": 1654830000, "usage": 0.5511, "ghg_emissions": 0.1611798598949212 }, { "start": 1654830000, "end": 1654833600, "usage": 1.6937, "ghg_emissions": 0.5144434346575449 }, { "start": 1654833600, "end": 1654837200, "usage": 1.1669, "ghg_emissions": 0.3460552007663447 }, { "start": 1654837200, "end": 1654840800, "usage": 0.6511, "ghg_emissions": 0.17810553425570927 }, { "start": 1654840800, "end": 1654844400, "usage": 0.409, "ghg_emissions": 0.11647091965751298 }, { "start": 1654844400, "end": 1654848000, "usage": 0.3245, "ghg_emissions": 0.10037674977612292 }, { "start": 1654848000, "end": 1654851600, "usage": 0.2325, "ghg_emissions": 0.0734438188494492 }, { "start": 1654851600, "end": 1654855200, "usage": 0.2508, "ghg_emissions": 0.07852108206135712 }, { "start": 1654855200, "end": 1654858800, "usage": 0.2123, "ghg_emissions": 0.06944624536071992 }, { "start": 1654858800, "end": 1654862400, "usage": 0.2732, "ghg_emissions": 0.09044368095672443 }, { "start": 1654862400, "end": 1654866000, "usage": 0.2694, "ghg_emissions": 0.09396326291079811 }, { "start": 1654866000, "end": 1654869600, "usage": 0.2545, "ghg_emissions": 0.09260862837899336 }, { "start": 1654869600, "end": 1654873200, "usage": 0.2999, "ghg_emissions": 0.10501561603375527 }, { "start": 1654873200, "end": 1654876800, "usage": 0.5176, "ghg_emissions": 0.13083147568357334 }, { "start": 1654876800, "end": 1654880400, "usage": 0.9371, "ghg_emissions": 0.16349352361948555 }, { "start": 1654880400, "end": 1654884000, "usage": 2.783, "ghg_emissions": 0.35013133078798475 }, { "start": 1654884000, "end": 1654887600, "usage": 2.4519, "ghg_emissions": 0.2995767278063097 }, { "start": 1654887600, "end": 1654891200, "usage": 1.7684, "ghg_emissions": 0.18896502878289473 }, { "start": 1654891200, "end": 1654894800, "usage": 1.698, "ghg_emissions": 0.18962619198982836 }, { "start": 1654894800, "end": 1654898400, "usage": 0.6466, "ghg_emissions": 0.061288937162233756 }, { "start": 1654898400, "end": 1654902000, "usage": 0.4932, "ghg_emissions": 0.0478961976592978 }, { "start": 1654902000, "end": 1654905600, "usage": 0.8322, "ghg_emissions": 0.08326978761591386 }, { "start": 1654905600, "end": 1654909200, "usage": 1.1517, "ghg_emissions": 0.1288177146311971 }, { "start": 1654909200, "end": 1654912800, "usage": 3.0498, "ghg_emissions": 0.7327653147570409 }, { "start": 1654912800, "end": 1654916400, "usage": 3.5792, "ghg_emissions": 1.226404697687604 }, { "start": 1654916400, "end": 1654920000, "usage": 1.6494, "ghg_emissions": 0.5659515863689777 }, { "start": 1654920000, "end": 1654923600, "usage": 0.6689, "ghg_emissions": 0.215048727126483 }, { "start": 1654923600, "end": 1654927200, "usage": 0.6314, "ghg_emissions": 0.20664285063940732 }, { "start": 1654927200, "end": 1654930800, "usage": 0.6943, "ghg_emissions": 0.23036513253329816 }, { "start": 1654930800, "end": 1654934400, "usage": 1.6525, "ghg_emissions": 0.5515585911784069 }, { "start": 1654934400, "end": 1654938000, "usage": 1.4809, "ghg_emissions": 0.4593003321285533 }, { "start": 1654938000, "end": 1654941600, "usage": 1.3543, "ghg_emissions": 0.40330961033716944 }, { "start": 1654941600, "end": 1654945200, "usage": 1.3924, "ghg_emissions": 0.4318915537232672 }, { "start": 1654945200, "end": 1654948800, "usage": 1.5496, "ghg_emissions": 0.4884573685304511 }, { "start": 1654948800, "end": 1654952400, "usage": 1.382, "ghg_emissions": 0.438954772317983 }, { "start": 1654952400, "end": 1654956000, "usage": 1.3833, "ghg_emissions": 0.43921416437671745 }, { "start": 1654956000, "end": 1654959600, "usage": 1.5253, "ghg_emissions": 0.46920900296533957 }, { "start": 1654959600, "end": 1654963200, "usage": 0.7764, "ghg_emissions": 0.1992540997957397 }, { "start": 1654963200, "end": 1654966800, "usage": 1.9603, "ghg_emissions": 0.27152375404530743 }, { "start": 1654966800, "end": 1654970400, "usage": 5.0481, "ghg_emissions": 0.6653090941385434 }, { "start": 1654970400, "end": 1654974000, "usage": 3.5673, "ghg_emissions": 0.4940288517022504 }, { "start": 1654974000, "end": 1654977600, "usage": 1.705, "ghg_emissions": 0.2152599629790941 }, { "start": 1654977600, "end": 1654981200, "usage": 1.3922, "ghg_emissions": 0.1383747245333933 }, { "start": 1654981200, "end": 1654984800, "usage": 0.7597, "ghg_emissions": 0.09302093809060191 }, { "start": 1654984800, "end": 1654988400, "usage": 0.3185, "ghg_emissions": 0.03465300267030282 }, { "start": 1654988400, "end": 1654992000, "usage": 2.1071, "ghg_emissions": 0.23269564842275545 }, { "start": 1654992000, "end": 1654995600, "usage": 1.9027, "ghg_emissions": 0.23561427279123529 }, { "start": 1654995600, "end": 1654999200, "usage": 2.2059, "ghg_emissions": 0.4891006427448442 }, { "start": 1654999200, "end": 1655002800, "usage": 0.6678, "ghg_emissions": 0.20155188982796346 }, { "start": 1655002800, "end": 1655006400, "usage": 3.5279, "ghg_emissions": 1.0955885586924219 }, { "start": 1655006400, "end": 1655010000, "usage": 2.5836, "ghg_emissions": 0.7909179937515832 }, { "start": 1655010000, "end": 1655013600, "usage": 2.2459, "ghg_emissions": 0.6726600962372117 }, { "start": 1655013600, "end": 1655017200, "usage": 2.1011, "ghg_emissions": 0.6692892000916801 }, { "start": 1655017200, "end": 1655020800, "usage": 1.7634, "ghg_emissions": 0.5803703451628586 }, { "start": 1655020800, "end": 1655024400, "usage": 1.839, "ghg_emissions": 0.5826874936862309 }, { "start": 1655024400, "end": 1655028000, "usage": 1.7292, "ghg_emissions": 0.499846875 }, { "start": 1655028000, "end": 1655031600, "usage": 1.6795, "ghg_emissions": 0.495315335753176 }, { "start": 1655031600, "end": 1655035200, "usage": 1.6604, "ghg_emissions": 0.4866365586760822 }, { "start": 1655035200, "end": 1655038800, "usage": 1.7352, "ghg_emissions": 0.5091645455520979 }] },