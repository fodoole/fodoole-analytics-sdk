/* global qeen */
import React, { useEffect } from 'react';
import "../styles/About.css";

function About() {
  useEffect(() => {
    qeen.bindClickEvents(
      [
        new qeen.InteractionEvent('MORE_INFO', '#more-info'),
      ]
    );
    qeen.bindScrollEvents(
      [
        new qeen.InteractionEvent('SCROLL_TITLE', 'h3'),
        new qeen.InteractionEvent('SCROLL_DESC', '#description')
      ]
    );

  }, []);

  return (
    <div className="container">
      <h1 className="title">About Us</h1>
      <p className="content">
        Welcome to our page! We're thrilled to have you here.
      </p>
      <button id="more-info" className='moreInfoButton'>More Info</button>
      <div id='description' className='description'>
        <h3>Description</h3>
        <p>hi</p>
      </div>
    </div>
  );
}

export default About;