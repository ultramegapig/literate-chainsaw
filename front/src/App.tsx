import '../src/styles/all.scss';
import './styles/fonts.css';
import Calendar from './images/calendar.svg';
import HomeIcon from './images/homeIcon.svg';
import LectureIcon from './images/lectureIcon.svg';
import TestsIcon from './images/testsIcon.svg';
import StatisticIcon from './images/statisticIcon.svg';
import ActiveHomeIcon from './images/activeHomeIcon.svg';
import ActiveCalendar from './images/activeCalendarIcon.svg';
import ActiveLectureIcon from './images/activeCourseIcon.svg';
import ActiveTestsIcon from './images/activeTestsIcon.svg';
import ActiveStatisticIcon from './images/activeStatisticIcon.svg';
import React, { useState, lazy, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import './styles/sideBar.scss';
import Login from './components/Login';
import Register from './areas/Register';
import YouTubePlayer from './components/YoutubePlayer';
import CourseDescriptionPage from './areas/CourseDescriptionPage';


import BarChart from './components/Barchart';
import DonutChart from './components/Donutchart';
import MainPageTeacher from './areas/MainPageTeacher';

const MainPage = lazy(() => import('./areas/MainPage'));
const Table = lazy(() => import('./areas/Table'));
const Courses = lazy(() => import('./areas/Courses'));
const Tests = lazy(() => import('./areas/Tests'));
const Progress = lazy(() => import('./areas/Progress'));
const Numbers = lazy(() => import('./areas/Numbers'));
const Podrobnosti = lazy(() => import('./areas/Podrobnosti'));

// Module configuration
interface Module {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  label: string;
  icon: string;
  activeIcon: string;
}

const modules: { [key: number]: Module } = {
  1: { path: '/', component: MainPage, label: 'Главная', icon: HomeIcon, activeIcon: ActiveHomeIcon },
  2: { path: '/table', component: Table, label: 'Расписание', icon: Calendar, activeIcon: ActiveCalendar },
  3: { path: '/courses', component: Courses, label: 'Курсы', icon: LectureIcon, activeIcon: ActiveLectureIcon },
  4: { path: '/tests', component: Tests, label: 'Тесты', icon: TestsIcon, activeIcon: ActiveTestsIcon },
  5: { path: '/progress', component: Progress, label: 'Успеваемость', icon: StatisticIcon, activeIcon: ActiveStatisticIcon }
};

// App content component
const AppContent: React.FC = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState<number | null>(() => {
    const storedActiveLink = localStorage.getItem('activeLink');
    return storedActiveLink ? parseInt(storedActiveLink) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuthState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  }, [setAuthState]);

  if (!authState.isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    );
  }

  const handleLinkClick = (key: number) => {
    setActiveLink(key);
    localStorage.setItem('activeLink', key.toString());
  };
  
  return (
    <div className="App">
      <header className="header">
        <div className="logo"><img src={Logo} alt=''/></div>
        <div className="rightHeader">
          <div className="notifications"><img src={Notification} alt=''/></div>
          <div className="userStuff"></div>
        </div>
      </header>

      <div className="mainArea">
        <div className="sideBar">
          {Object.keys(modules).map((key) => (
            <Link
              key={key}
              onClick={() => handleLinkClick(parseInt(key))}
              to={modules[parseInt(key)].path}
              className={`sideBarElement ${activeLink === parseInt(key) ? 'activeshit' : ''}`}
            >
              <img
                className={`sidebar-icon ${activeLink === parseInt(key) ? 'activeshit' : ''}`}
                src={activeLink === parseInt(key) ? modules[parseInt(key)].activeIcon : modules[parseInt(key)].icon}
                alt=""
              />
              <div className="sideBar-text">{modules[parseInt(key)].label}</div>
            </Link>
          ))}
        </div>

        <div className="changingArea">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {Object.keys(modules).map((key) => (
                <Route key={key} path={modules[parseInt(key)].path} element={React.createElement(modules[parseInt(key)].component)} />
              ))}
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:course_id" element={<CourseDescriptionPage />} />
              <Route path="/video/:video_id" element={<YouTubePlayer/>} />

            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent/>
        
      </Router>
    </AuthProvider>
  );
};

export default App;
