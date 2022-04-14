import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, makeStyles, Tab, Tabs, TextField, useTheme, } from "@material-ui/core";
import wall from '../assets/wall.jpg'
import { useParams, useHistory, useN } from "react-router-dom";
import axios from "axios";
import Context from "../utils/context";

const Login = () => {
    const theme = useTheme();

    const [formValue, setFormValue] = useState({});
    const [showPassword, setShowPassword] = useState(false)
    const [tabValue, setTabValue] = useState(0);
    let { action } = useParams();
    let history = useHistory();
    const classes = useStyles();
    const [data, setData] = useContext(Context);

    const API_URL = process.env.REACT_APP_BACKEND_DOMAIN;


    const handleChange = (event, newValue) => {
        // setTabValue(newValue);
        if (newValue === 0) {
            history.replace('/auth/signin')
        } else {
            history.replace('/auth/signup')
        }
    };

    const handlelogin = () => {
        axios.post(`http://${API_URL}/user/login`, formValue['login'])
            .then(res => {
                localStorage.setItem('token', res.data?.access_token)
                setData({ ...data, 'user': res.data?.user })
                setFormValue({})
                history.replace('/')

            }).catch(err => {
                console.log('>>> login error', err.response)
            })
    };

    const handlesignup = () => {
        axios.post(`http://${API_URL}/user/user`, formValue['signup'])
            .then(res => {
                setFormValue({ 'login': { 'username': formValue['signup'].username, 'password': formValue['signup'].password } })
                history.replace('/auth/signin')

            }).catch(err => {
                console.log('>>> login error', err.response)
            })
    };

    useEffect(() => {
        if (action === 'signin') {
            setTabValue(0)
        }
        else if (action === 'signup') {
            setTabValue(1)
        }
    })
    return (
        <>
            <Box
                sx={{
                    background: "rgba(0, 0, 0, 0.04)",
                    borderRadius: 20,
                    margin: 20,

                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    justifyContent: 'center',

                }}
            >
                <Container component="form" maxWidth="sm"
                    style={{
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Tabs value={tabValue} onChange={handleChange} classes={{ indicator: classes.backgroundIndicator }} centered>
                        <Tab label="Signin" id="simple-tabpanel-0" aria-labelledby="simple-tab-0" />
                        <Tab label="Signup" id="simple-tabpanel-1" aria-labelledby="simple-tab-1" />
                    </Tabs>
                    <Box component="div"
                        sx={{
                            height: '100%',
                            transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1) 500ms"
                        }}
                    >
                        <Box
                            role="tabpanel"
                            hidden={tabValue !== 0}
                            id={`simple-tabpanel-${0}`}
                            aria-labelledby={`simple-tab-${0}`}
                            sx={{
                                '& >:not(style)': {
                                    // margin: 10
                                },
                            }}
                        >
                            {tabValue === 0 && (
                                <>
                                    <TextField
                                        fullWidth id="username"
                                        label="Username"
                                        variant="outlined"
                                        margin="normal"
                                        value={formValue['login']?.username}
                                        onChange={(event) => setFormValue({ ...formValue, 'login': { ...formValue['login'], 'username': event.target.value } })} />
                                    <TextField
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        margin="normal"
                                        value={formValue['login']?.password}
                                        onChange={(event) => setFormValue({ ...formValue, 'login': { ...formValue['login'], 'password': event.target.value } })} />
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    } label="Show Password" />
                                    <Box
                                        sx={{
                                            py: 2,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}>
                                        <Button variant="contained" color="primary" style={{ width: "50%" }} onClick={handlelogin}>Sign In</Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                        <Box
                            role="tabpanel"
                            hidden={tabValue !== 1}
                            id={`simple-tabpanel-${1}`}
                            aria-labelledby={`simple-tab-${1}`}

                        >{tabValue === 1 && (
                            <>
                                <TextField fullWidth
                                    id="username"
                                    label="Username"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValue['signup']?.username}
                                    onChange={(event) => setFormValue({ ...formValue, 'signup': { ...formValue['signup'], 'username': event.target.value } })} />
                                <TextField fullWidth
                                    id="email"
                                    type="email"
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValue['signup']?.email}
                                    onChange={(event) => setFormValue({ ...formValue, 'signup': { ...formValue['signup'], 'email': event.target.value } })} />
                                <TextField fullWidth
                                    id="password"
                                    label="Password"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValue['signup']?.password}
                                    onChange={(event) => setFormValue({ ...formValue, 'signup': { ...formValue['signup'], 'password': event.target.value } })} />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        my: 2
                                    }}>
                                    <Button variant="contained" color="primary" style={{ width: "50%" }} onClick={handlesignup}>Sign Up</Button>
                                </Box>
                            </>
                        )}
                        </Box>
                    </Box>

                    {/* </SwipeableViews> */}
                </Container>
            </Box>
        </>
    )
};

const useStyles = makeStyles((theme) => ({
    alignCenter: {
        // margin: 10
        // textAlign: "center"
        margin: "0 auto"
    },
    backgroundIndicator: {
        backgroundColor: theme.palette.primary
    }
}));



export default Login;