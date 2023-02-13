import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Charge from './pages/Charge';
import Sandbox from './pages/Sandbox';
import {
  Elements,

} from "@stripe/react-stripe-js";
import {loadStripe} from '@stripe/stripe-js';

function App() {
  const stripePromise = loadStripe('pk_test_51Magw9IF5UWrgtqLLf8vGqLR3hLV799pZMqbyeGUfmOcTlh8A4e7voEt5qk9BWP1zu8IE1ewM304RQ5TrAuRSPCy00XaV5iPDH');
  return (
    <Elements stripe={stripePromise}>
    
    <BrowserRouter>
      <Routes>
        {/* <Route exact path="/" component={<Home />} /> */}
        <Route exact path="/" element={<Home />} />
        <Route path="/charge" element={<Charge />} />
        <Route path="/sandbox" element={<Charge />} />
      </Routes>  
    </BrowserRouter>
    </Elements>
  );
}

export default App;
