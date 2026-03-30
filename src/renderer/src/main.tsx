import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import App from './App'
import Home from './pages/Home'
import Goods from './pages/Goods'
import FrontDeskSales from './pages/FrontDeskSales'
import Payments from './pages/Payments'
import BillsPage from './pages/Bills'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <StrictMode>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/goods" element={<Goods />} />
          <Route path="/front_desk_sales" element={<FrontDeskSales />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/bills" element={<BillsPage />} />
        </Route>
      </Routes>
    </StrictMode>
  </HashRouter>
)
