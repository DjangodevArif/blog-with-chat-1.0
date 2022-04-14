import React from "react";
import {
    AppBar, Badge, Box, Container, CssBaseline,
    Divider, Tabs, Tab, Drawer, IconButton, List,
    ListItem, ListItemIcon, ListItemText,
    Toolbar, Typography, Collapse
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Backdrop, CircularProgress } from '@mui/material';
import { ChevronLeft, Menu, Mail, Inbox, Notifications, AccountCircle, Logout, EmojiPeople, Textsms, ViewCarousel, Feed, Login, LocalMall } from '@mui/icons-material';
import axios from "axios";
import clsx from "clsx";
import { useState, useEffect, useContext } from "react";
import ChatSocket from "../component/Chat";
import Blogs from "../component/Blogs";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useRouteMatch,
} from "react-router-dom";
import Context from "../utils/context";
import WellcomePage from "../component/Welcome";


const HomePage = () => {

    const classes = useStyles();

    const [open, setOpen] = useState(true);
    const [friends, setFriends] = useState([]);
    const [mailCount, setMailCount] = useState();
    const [listShow, setListShow] = useState(true);
    const [data, setData, user, setUser] = useContext(Context);
    let { pathname } = useLocation();
    let { path, url } = useRouteMatch();
    const [onPage, setOnPage] = useState(pathname);
    const [wait, setWait] = useState(false);
    const history = useHistory()
    const API_URL = process.env.REACT_APP_BACKEND_DOMAIN;


    const CustomHomeLink = (props) => <Link to="/" {...props} />;
    const CustomMessengerLink = (props) => <Link to="/message" {...props} />;

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const handlePageChange = () => {
        const regex = /^\/message\/.*?$/.test(pathname)
        if (regex) {
            setOnPage("/message")
        } else {
            setOnPage(pathname)
        }

    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
            axios.get(`http://${API_URL}/user/me`)
                .then(res => {
                    // setData({ ...data, 'user': res?.data })
                    setUser(res?.data)
                    setWait(true)
                })
                .catch(error => {
                    setWait(true)
                    localStorage.removeItem('token');
                    var location = history.location.pathname
                    history.push('/auth/signin', { from: location })
                    console.log('>>>> existing token validation error', error?.response)
                })
        } else {
            setWait(true)
            var location = history.location.pathname
            history.push('/auth/signin', { from: location })
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.get(`http://${API_URL}/chat/friend-list`)
            .then(res => {
                setFriends(res?.data)
            })
            .catch(err => {
                // localStorage.removeItem('token')
                // var location = history.location.pathname
                // history.push('/auth/signin', { from: location })

                console.log('>>> getting friend-list error', err.response)
            })
        axios.get(`http://${API_URL}/chat/chat-notification`)
            .then(res => {
                setMailCount(res.data?.unseen_message)
            }).catch(err => {
                console.log('>>>>>> mail count error', err.response)
            })
    }, []);

    useEffect(() => {
        handlePageChange()
    }, [pathname]);

    return (
        <>
            {
                wait ?

                    <Box >
                        <CssBaseline />
                        <Container >
                            <AppBar
                                position="fixed"
                                className={clsx({ [classes.appBar]: open })}
                            >
                                <Toolbar className={classes.space}>
                                    <div className={classes.flexLeft}>
                                        <Typography variant="h6" noWrap>
                                            Oursite
                                        </Typography>

                                    </div>
                                    <div className={classes.flexManue}  >
                                        <Tabs
                                            value={onPage}
                                            // onChange={handlePageChange}
                                            // textColor="#fff"
                                            // indicatorColor="primary"
                                            aria-label="secondary tabs example"
                                        >
                                            <Tab value="/" label="Blog" component={Link} to="/" />
                                            <Tab value="/message" label="Messenger" component={Link} to="/message" />
                                            <Tab value="/gallery" label="Gallery" />
                                            <Tab value="/gallery" label="Market" />
                                            {/* <Typography variant="h6" noWrap component="div">
                                    Gallery
                                    </Typography> */}
                                        </Tabs>
                                    </div>
                                    <div className={classes.flexRight}>
                                        <div>
                                            <IconButton aria-label="show 4 new mails" color="inherit">
                                                <Badge badgeContent={mailCount} color="secondary">
                                                    <Mail />
                                                </Badge>
                                            </IconButton>
                                        </div>
                                        <div>
                                            <IconButton aria-label="show 17 new notifications" color="inherit">
                                                <Badge badgeContent={0} color="secondary">
                                                    <Notifications />
                                                </Badge>
                                            </IconButton>
                                        </div>
                                    </div>
                                    <IconButton edge="start" color="inherit" aria-label="account" className={clsx({ [classes.drawerManu]: open })} >
                                        <AccountCircle />
                                    </IconButton>
                                    <IconButton edge="start" color="inherit" aria-label="menu" className={clsx({ [classes.drawerManu]: open })} onClick={handleDrawerOpen}>
                                        <Menu />
                                    </IconButton>
                                </Toolbar>
                            </AppBar>
                            <Drawer
                                variant="persistent"
                                anchor="left"
                                open={open}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                <IconButton onClick={handleDrawerClose}>
                                    <ChevronLeft />
                                </IconButton>
                                <Divider />
                                <List>
                                    <ListItem button selected={pathname == "/"} component={Link} to="/">
                                        <ListItemIcon><Feed /></ListItemIcon>
                                        <ListItemText primary="Blog" />
                                    </ListItem>
                                    <ListItem button selected={onPage == "/message"} onClick={() => setListShow(!listShow)} >
                                        <ListItemIcon ><Textsms /></ListItemIcon>
                                        <ListItemText primary="Messenger" />
                                    </ListItem >
                                    <Collapse in={listShow} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                friends?.map((i, index) =>
                                                (
                                                    // <Link to={}>
                                                    <ListItem button selected={pathname == `/message/${i.id}`} component={Link} to={`/message/${i.id}`} key={index} style={{ paddingLeft: 30 }}>
                                                        <ListItemIcon>
                                                            <Badge
                                                                component="div"
                                                                overlap="circular"
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                variant="dot"
                                                                color="error"
                                                                invisible={!(i.id in data?.unseen_message)}>
                                                                <EmojiPeople />
                                                            </Badge>
                                                        </ListItemIcon>
                                                        <ListItemText primary={i?.username} secondary={data?.unseen_message[i.id] ? `${data?.unseen_message[i.id]} ...` : ''} />
                                                    </ListItem>
                                                    // </Link>
                                                )
                                                )
                                            }
                                        </List>
                                    </Collapse>
                                    <ListItem button selected={pathname == "/gallery"}>
                                        <ListItemIcon><ViewCarousel /></ListItemIcon>
                                        <ListItemText primary="Gallery" />
                                    </ListItem>
                                    <ListItem button selected={pathname == "/market"}>
                                        <ListItemIcon><LocalMall /></ListItemIcon>
                                        <ListItemText primary="Market" />
                                    </ListItem>
                                    <ListItem button >
                                        <ListItemIcon><AccountCircle /></ListItemIcon>
                                        <ListItemText primary="Profile" />
                                    </ListItem>
                                    <ListItem button component={Link} to="/auth/signin">
                                        <ListItemIcon><Login /></ListItemIcon>
                                        <ListItemText primary="Login" />
                                    </ListItem>
                                    <ListItem button component={Link} to="/auth/logout">
                                        <ListItemIcon><Logout /></ListItemIcon>
                                        <ListItemText primary="Logout" />
                                    </ListItem>

                                </List>
                            </Drawer>
                            <section className={clsx(classes.main,
                                { [classes.mainLeft]: open })}
                            >
                                <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={data.loder}
                                // onClick={handleLoderClose}
                                >
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                                <div className={classes.drawerHeader} />
                                {/* <ChatSocket /> */}
                                <Route path={`/message${path}:id`} >
                                    <ChatSocket value={friends} />
                                </Route>
                                <Route path={`/message`} exact={true}>
                                    <WellcomePage />
                                </Route>
                                <Route exact path="/" >
                                    <Blogs />
                                </Route>
                            </section>
                        </Container>
                    </Box>
                    :
                    <>
                    </>
            }
        </>

    )
};

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
    root: {
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    mainLeft: {
        marginLeft: drawerWidth
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    flexLeft: {
        display: "flex",
        flex: 1,
    },
    flexManue: {
        display: "flex",
        flex: 1,
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
        '& div': {
            flex: 1
        }
    },
    flexRight: {
        display: "flex",
        flex: 1,
        justifyContent: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    drawerManu: {
        display: 'none',
        // [theme.breakpoints.up('md')]: {
        //     display: 'none',
        // },
    }
}));

export default HomePage;