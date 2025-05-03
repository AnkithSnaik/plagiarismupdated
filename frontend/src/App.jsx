import React from 'react'
import Home from './Home/Home'
import Course from './Components/Course'
import Signup from './Components/Signup'
import Login from './Components/Login'
import FileUpload from './Components/FileUpload'
import { Route, Routes } from "react-router-dom"
import Hero2 from './Components/hero2'


function App() {
  return (
    <>
    <div className="">
     <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/course" element={<Course/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/upload" element={<FileUpload/>}/>
        {/* <Route path='/anouncement' element={<Anuoncments/>}/> */}
        <Route path="/hero2" element={<Hero2/>}/>
     </Routes>
    </div>
    </>
  )
}

export default App