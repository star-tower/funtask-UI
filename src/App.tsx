import React from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {ChakraProvider} from '@chakra-ui/react'
import {router} from "./router";


function App() {
    return <ChakraProvider>
        <React.StrictMode>
            <RouterProvider router={router}/>
        </React.StrictMode>
    </ChakraProvider>;
}

export default App;
