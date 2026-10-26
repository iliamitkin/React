import { Suspense, lazy } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './pages/Dashboard';
import './styles.css';
import { trackPageView } from './monitoring';
import { useEffect } from 'react';

const Insights = lazy(() => import('./pages/Insights'));

function Layout() {
  const location = useLocation();
  useEffect(() => { trackPageView(location.pathname); }, [location.pathname]);
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/"><span className="brand-mark">r</span><span>ритм<span className="brand-dot">.</span></span></a>
      <div className="side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav className="side-nav" aria-label="Основная навигация">
        <NavLink to="/" end><span>▦</span> Мои привычки</NavLink>
        <NavLink to="/insights"><span>◷</span> Обзор недели</NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="mini-avatar">П</div><div><b>Профиль</b><small>Личный план</small></div><span className="dots">···</span></div>
    </aside>
    <main className="main-area"><header className="topbar"><span>Понедельник, 12 мая</span><span className="topbar-right"><span className="live-dot"/> Твой темп — твои правила <span className="avatar">А</span></span></header>
      <Routes><Route path="/" element={<Dashboard/>}/><Route path="/insights" element={<Suspense fallback={<div className="loading-card">Готовим обзор…</div>}><Insights/></Suspense>}/><Route path="*" element={<Dashboard/>}/></Routes>
    </main>
  </div>
}

export default function App() { return <Provider store={store}><BrowserRouter><Layout/></BrowserRouter></Provider>; }
