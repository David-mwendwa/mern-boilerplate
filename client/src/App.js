import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<div>MERN APP</div>} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
