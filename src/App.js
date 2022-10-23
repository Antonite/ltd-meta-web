import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from "./Nav"
import Builds from './Builds';
import Guides from './Guides';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Guides />} />
          <Route path="guides" element={<Guides />} />
          <Route path="builds" element={<Builds />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;