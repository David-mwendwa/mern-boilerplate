import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h4>e-commerce MERN boilerplace</h4>
      </nav>
      <Routes>
        <Route path='/' element={<div>HOMEPAGE</div>} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
