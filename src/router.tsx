import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {Worker} from "./pages/Worker";
import React from "react";
import {Navigator} from "./components/Navigator";
import {Task} from "./pages/Task";
import {CronTask} from "./pages/CronTask";


export const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Navigator/>}>
        <Route index element={<Worker/>}/>
        <Route path='worker' element={<Worker/>}/>
        <Route path='task' element={<Task/>}/>
        <Route path='task_group' element={<></>}/>
        <Route path='cron_task' element={<CronTask/>}/>
        <Route path='function' element={<></>}/>
        <Route path='arguments_pool' element={<></>}/>
        <Route path='connections' element={<></>}/>
    </Route>
));
