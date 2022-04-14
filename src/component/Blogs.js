import { Box, Container, CssBaseline } from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Post from './Post';
import useWindowSize from "../utils/windowSize"
import CreatePost from './CreatePost';
import Context from '../utils/context';


const API_URL = process.env.REACT_APP_BACKEND_DOMAIN;

const Blogs = () => {
    // const size = useWindowSize();
    const size = useWindowSize();
    const [newsArchive, setNewsArichive] = useState([]);
    const APIKEY = "b6f28514811142559ba7bbbcbd45dda0";
    const [data, setData] = useContext(Context);
    const [news, setNews] = useState([{}])

    function shuffleArray(array) {

        for (var i = array.length - 1; i > 0; i--) {

            // Generate random number
            var j = Math.floor(Math.random() * (i + 1));

            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;

    };

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        axios.get(`http://${API_URL}/feed/feeds`)
            .then(res => {
                // const new_array = shuffleArray([...temp_news, ...res?.data])
                setData({ ...data, 'post': res?.data })

            }).catch(err => {
                console.log(' >>>>> news api error', err.response)
            })
    }, []);

    return (
        <>
            <CssBaseline />
            <Container maxWidth="md">
                <Box
                    sx={{
                        bgcolor: 'rgb(220 223 225)',
                        // height: `calc(${window.innerHeight}px - 112px)`,
                        height: `calc(${size.height}px - 112px)`,
                        marginY: 3,
                        p: 2,
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    style={{
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}>

                    <CreatePost />
                    {
                        // shuffleArray([...news, ...data?.post])?.map((element, index) => (
                        data?.post?.map((element, index) => (
                            <Post value={element} key={element?.id} />
                        )
                        )
                    }
                </Box>
            </Container>
        </>
    )
};

// function useWindowSize() {
//     // Initialize state with undefined width/height so server and client renders match
//     // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
//     const [windowSize, setWindowSize] = useState({
//         width: undefined,
//         height: undefined,
//     });
//     useEffect(() => {
//         // Handler to call on window resize
//         function handleResize() {
//             // Set window width/height to state
//             setWindowSize({
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             });
//         }
//         // Add event listener
//         window.addEventListener("resize", handleResize);
//         // Call handler right away so state gets updated with initial window size
//         handleResize();
//         // Remove event listener on cleanup
//         return () => window.removeEventListener("resize", handleResize);
//     }, []); // Empty array ensures that effect is only run on mount
//     return windowSize;
// };

export default Blogs;