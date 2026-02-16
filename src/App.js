import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import SpecialPuja from './components/SpecialPuja/SpecialPuja';
import Reviews from './components/Reviews/Reviews';
import AboutStats from './components/AboutStats/AboutStats';
import Features from './components/Features/Features';
import ArticlesSection from './components/ArticlesSection/ArticleSection';
import Footer from './components/Footer/Footer';
import Faqs from './components/Faqs/Faqs';
import PujaList from './components/PujaList/PujaList';
import PujaDetail from './components/PujaDetail/PujaDetail';
import Chadhava from './components/Chadhava/Chadhava';
import ChadhavaDetail from './components/Chadhava/ChadhavaDetail';
import Profile from './components/Profile/Profile';
import LoginPage from './components/LoginPage/LoginPage';
import BillingPage from './components/BillingPage/BillingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <Layout>
            <Home />
            <SpecialPuja />
            <Faqs />
            <Reviews />
            <AboutStats />
            <Features />
            <ArticlesSection />
            <Footer />
          </Layout>
        } />

        

        <Route path="/Profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />
        <Route path="/puja" element={
          <Layout>
            <PujaList />
          </Layout>
        } />
        <Route path="/chadhava" element={
          <Layout>
            <Chadhava />
          </Layout>
        } />
        <Route path="/chadhava/:id" element={
          <Layout>
            <ChadhavaDetail />
          </Layout>
        } />
        <Route path="/puja/:id" element={
          <Layout>
            <PujaDetail />
          </Layout>
        } />

        {
          <Route path="/billing" element={
            <Layout>
              <BillingPage/>
            </Layout>
          } />
          }
        







      </Routes>
    </BrowserRouter>
  );
}

export default App;