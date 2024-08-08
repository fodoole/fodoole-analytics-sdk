/* global qeen */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function ProductLink({ product }) {
  return (
    <div className="productContainer product">
      <Link to={`/product/${product.id}#qeen-dev`} style={{ textDecoration: 'none' }}>
        <img src={product.image} alt={product.title} className='productImage' style={{ marginRight: '0' }} />
        <h3 className='productTitle'>{product.title}</h3>
        <p className='productPrice'>${product.price}</p>
      </Link>
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    fetch('/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Server response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setRender(true);

      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (render) {
      qeen.bindClickEvents([new qeen.InteractionEvent('CLICK_PRODUCT', '.product')]);
    }
  }, [render]);


  return (
    <div className='container'>
      <div className='grid'>
        {products.map((product) => (
          <ProductLink key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;