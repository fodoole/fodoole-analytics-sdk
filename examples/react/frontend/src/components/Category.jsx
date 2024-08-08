import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import ItemCard from "./ItemCard";

const Category = () => {
  const [cat, setCat] = useState([]);
  const [items, setItems] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:3000/api/categories/${id}`
        );
        setCat(response.data);
      } catch (error) {
        console.error("Failed to fetch categories: ", error);
      }
      try {
        const response = await axios.get(
          `http://127.0.0.1:3000/api/products?category=${id}`
        );
        setItems(response.data.results);
      } catch (error) {
        console.error("Failed to fetch categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container style={{ padding: "50px 30px" }}>
      <h2>@{cat.name}</h2>
      <Row>
        {items.map((item) => (
          <Col
            key={item.id}
            sm={6}
            lg={4}
            xl={3}
            style={{ marginBottom: "20px" }}
          >
            <ItemCard item={item}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Category;
