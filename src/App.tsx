import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import SpacesList from './components/SpacesList';
import CreateSpace from './components/CreateSpace';
import SpaceDetails from './components/SpaceDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<SpacesList />} />
            <Route path="/create" element={<CreateSpace />} />
            <Route path="/space/:id" element={<SpaceDetails />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;