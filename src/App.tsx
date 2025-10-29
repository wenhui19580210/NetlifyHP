import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import BlogPost from './pages/BlogPost';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/blog/:id" element={<BlogPost />} />
              </Routes>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
