import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/Landing/LandingPage';
import { SelfModeForm } from './components/SelfMode/SelfModeForm';
import { SelfModeResult } from './components/SelfMode/SelfModeResult';
import { GiftModeForm } from './components/GiftMode/GiftModeForm';
import { GiftModeResult } from './components/GiftMode/GiftModeResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/me" element={<SelfModeForm />} />
        <Route path="/me/result" element={<SelfModeResult />} />
        <Route path="/gift" element={<GiftModeForm />} />
        <Route path="/gift/result" element={<GiftModeResult />} />
        <Route path="/share/:encodedId" element={<GiftModeResult />} />
      </Routes>
    </Router>
  );
}

export default App;
