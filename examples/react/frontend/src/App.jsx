import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Item from "./components/Item";
import Category from "./components/Category";
import Tag from "./components/Tag";
import Cart from "./components/Cart";
import { PageDataProvider } from './components/PageDataContext'; // Import the provider

function App() {
  return (
    <PageDataProvider>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="/products/:id" element={<Item />} />
          <Route path="/categoreis/:id" element={<Category />} />
          <Route path="/tags/:id" element={<Tag />} />
          <Route path="/cart" element={<Cart />} />
      </Routes>
    </PageDataProvider>
  );
}

export default App;
