import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import WhatsAppFAB from './components/WhatsAppFAB/WhatsAppFAB';
import Home from './components/Home/Home';
import SpecialPuja from './components/SpecialPuja/SpecialPuja';
// import ArticlesSection from './components/ArticlesSection/ArticleSection';
import Footer from './components/Footer/Footer';
import Faqs from './components/Faqs/Faqs';
import PujaList from './components/PujaList/PujaList';
import PujaDetail from './components/PujaDetail/PujaDetail';
import Chadhava from './components/Chadhava/Chadhava';
import ChadhavaDetail from './components/Chadhava/ChadhavaDetail';
import Profile from './components/Profile/Profile';
import LoginPage from './components/LoginPage/LoginPage';
import BillingPage from './components/BillingPage/BillingPage';
import MyBookings from './components/MyBooking/MyBooking';
import BookingDetailsModal from './components/BookingDetailsModal/BookingDetailsModal';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import WhatsAppUpdates from './components/WhatsAppUpdatesSection/WhatsAppUpdatesSection';
function App() {
  return (
    <BrowserRouter>
      <WhatsAppFAB />
      <Routes>
      <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <Layout>
            <Home />
            <SpecialPuja />
            <WhatsAppUpdates />
            <Faqs />
            {/* <Reviews /> */}
            {/* <AboutStats /> */}
            {/* <Features /> */}
            {/* <ArticlesSection /> */}
            <Footer />
          </Layout>
        } />

        

        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
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
          <Route path="/my-bookings" element={
            <Layout>
              <MyBookings/>
            </Layout>
          } />
          {
          <Route path="/booking/:id" element={
            <Layout>
              <BookingDetailsModal />
            </Layout>
          } />
          }

          

        







      </Routes>
    </BrowserRouter>
  );
}

export default App;