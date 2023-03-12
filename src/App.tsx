import React from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {ChakraProvider} from '@chakra-ui/react'
import {router} from "./router";
import {QueryClient, QueryClientProvider} from "react-query";


function App() {
    return <ChakraProvider>
        <QueryClientProvider client={new QueryClient()}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </ChakraProvider>;
}

export default App;
