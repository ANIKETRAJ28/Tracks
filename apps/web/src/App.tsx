import { Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import TrackPage from './pages/Track';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/track/:trackId" element={<TrackPage />} />
    </Routes>
  );
}

export default App;
