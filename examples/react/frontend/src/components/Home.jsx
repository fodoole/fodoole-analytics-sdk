import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import ItemCard from "./ItemCard";
const baseurl = "http://127.0.0.1:3000";

const Home = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/products`);
        setItems(response.data.results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Container style={{ padding: "50px" }}>
        <Row>
          {items.map((item) => (
            <Col
              key={item.id}
              sm={6}
              lg={4}
              xl={3}
              style={{ marginBottom: "20px" }}
            >
              <ItemCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
