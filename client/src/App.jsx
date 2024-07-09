import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../components/login.jsx';
import {Admin} from '../components/admin.jsx'
import {RegisterUser} from '../components/register.jsx'
import { Member } from '../components/member.jsx';



function App() {

  

  return (
    <Routes>
      <Route path ='/' element ={<Navigate to = '/login'/>} />
      <Route path = '/login' element = {<LoginPage/>}/>
      <Route path = '/admin' element = {<Admin/>} />
      <Route path = '/member' element = {<Member/>} />
      <Route path='/register' element= {<RegisterUser/>}/>

    </Routes>
  )
}

export default App
