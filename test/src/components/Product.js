/* global qeen */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Product.css';

function Product() {
  let { id } = useParams();

  const [products, setProducts] = useState([]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    fetch('/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
      qeen.bindClickEvents(
        [
          new qeen.InteractionEvent('ADD_TO_CART', '#add-to-cart'),
          new qeen.InteractionEvent('ADD_TO_WISHLIST', '#add-to-wishlist'),
          new qeen.InteractionEvent('ATW', '#add-to-wishlist-carrousel')
        ]
      );
      qeen.bindScrollEvents(
        [
          new qeen.InteractionEvent('SCROLL_TITLE', 'h2'),
          new qeen.InteractionEvent('SCROLL_DESC', '#desc')
        ]
      );
    }
  }, [render]);

  if (products === undefined || products.length === 0) {
    return <div>Loading...</div>;
  }

  const productIndex = products.findIndex(product => product.id === parseInt(id));
  const product = products[productIndex];
  const relatedProduct = products[(productIndex + 1) % products.length];
  return (
    <>
      <div className='productContainer'>
        <img src={product.image} alt={product.title} className='productImage' />
        <div className='productDetails'>
          <h2 className='productTitle'>{product.title}</h2>
          <p className='productPrice'>Price: ${product.price}</p> {/* Adjust price as needed */}
          <button id='add-to-cart' className='addToCartButton productButton'>Add to Cart</button>
          <button id='add-to-wishlist' className='addToWishlistButton productButton'>Add to wishlist</button>
          <div className='buttonCarrousel'>
            <button id='add-to-wishlist-carrousel' className='addToWishlistCarrouselButton productButton'>Button 1</button>
            <button id='add-to-wishlist-carrousel' className='addToWishlistCarrouselButton productButton'>Button 2</button>
            <button id='add-to-wishlist-carrousel' className='addToWishlistCarrouselButton productButton'>Button 3</button>
          </div>
        </div>
      </div>
      <div className='productContainer'>
        <div className='relatedProduct'>
          <Link to={`/product/${relatedProduct.id}#qeen-dev`} style={{ textDecoration: 'none' }}>
            <img src={relatedProduct.image} alt={relatedProduct.title} className='productImage' style={{ marginRight: '0' }} />
            <h3 className='productTitle'>{relatedProduct.title}</h3>
            <p className='productPrice'>${relatedProduct.price}</p>
          </Link>
        </div>
      </div>
      <div className='desc'>
        <h3 id='desc'>Description</h3>
        <p id='desc'>{product.description}</p>
      </div>
    </>
  );
}

export default Product;