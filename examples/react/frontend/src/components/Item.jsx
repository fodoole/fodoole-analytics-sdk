import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CartModal from "./CartModal";
const baseurl = "http://127.0.0.1:3000";

export const Item = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${baseurl}/api/products/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container fluid style={{ minHeight: "100vh" }}>
      {item ? (
        <Card style={cardStyles}>
          <Row>
            <h1 style={cardTitleStyles}>{item.name}</h1>
            <Col className="left" sm={4} style={leftStyles}>
              <Card.Img src={item.image} style={cardImageStyles} />
              <Card.Text style={priceStyles}>{item.price} JD</Card.Text>
              <CartModal item={item} />
            </Col>
            <Col sm={8}>
              <p>{item.description}</p>
              <div className="tags" style={tagsStyles}>
                {item.tags.map((tag) => (
                  <Card.Link href={`/tags/${tag.id}`} key={tag.id}>
                    #{tag.tagname}
                  </Card.Link>
                ))}
              </div>
            </Col>
          </Row>
        </Card>
      ) : (
        "loading item"
      )}
    </Container>
  );
};

const cardStyles = {
  position: "reative",
  top: "10vh",
  minHeight: "26rem",
  maxWidth: "800px",
  padding: "20px",
  margin: "auto",
};

const leftStyles = {
  textAlign: "center",
  marginBottom: "20px",
};

const cardImageStyles = {
  width: "auto",
  marginInline: "auto",
  height: "10rem",
  display: "block",
};

const priceStyles = {
  fontSize: "28px",
  marginBottom: "10px",
  marginTop: "10px",
};

const buttonStyles = {
  marginBottom: "20px",
};
const cardTitleStyles = {
  margin: "10px 0px 40px",
  fontSize: "26px",
};

const tagsStyles = {
  marginBottom: "5px",
};

export default Item;
