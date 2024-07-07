import React from 'react'
import Home from './pages/home'
import Result from './pages/result'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App(){
    return(
        <Router>
        <Routes>
          <Route path = '/' element={<Home/>}/>
          <Route path = '/result' element={<Result/>}/>
        </Routes>
        </Router>
    )
}

export default App