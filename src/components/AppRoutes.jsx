import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router';
import Profile from './Profile';
import Login from './Login';
import Home from './Home';
import Body from './Body';

const AppRoutes = () => {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Body />}>
                    <Route index element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter></>)
}

export default AppRoutes;