import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Content from './frontend/views/content/content';
import Home from './frontend/views/home';
import Catalog from './frontend/views/catalog/catalog';
import Historic from './frontend/views/historic/historic';
import Inclusion from './frontend/views/inclusion/inclusion';
const App = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Content />}>
            <Route path='/' element={<Home />}/>
            <Route path='/catalogo' element={<Catalog />}/>
            <Route path='/historico' element={<Historic />}/>
            <Route path='/inclusao' element={<Inclusion />}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
