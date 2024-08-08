import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ item, deleteItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [showSave, setShowSave] = useState(false);

  const save = () => {
    setShowSave(false);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="d-flex align-items-center">
          <Col md={6} lg={12} xl={6} className="d-flex align-items-center my-2">
            <Card.Img
              src={item.product.image}
              style={{ width: "65px" }}
              alt="Shopping item"
            />
            <h5 className="ms-3 mb-0"> {item.product.name} </h5>
          </Col>

          <Col className="d-flex justify-content-between align-items-center my-2">
            <div className="d-flex justify-content-center align-items-center">
              <Button
                className="d-flex justify-content-center align-items-center"
                style={{ height: "30px", width: "30px", borderRadius: "50%" }}
                variant="dark"
                onClick={() => {
                  setQuantity(quantity + 1);
                  setShowSave(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <h5 className="m-2">{quantity}</h5>
              <Button
                className="d-flex justify-content-center align-items-center"
                style={{ height: "30px", width: "30px", borderRadius: "50%" }}
                variant="dark"
                onClick={() => {
                  setQuantity(quantity > 1 ? quantity - 1 : 1);
                  setShowSave(true);
                }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
            </div>

            <h5 md={6} lg={12} xl={6} className="mb-0">
              {(item.product.price * quantity).toFixed(2)} JD
            </h5>
            <a href="#!">
              {showSave ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: "green" }}
                  onClick={save}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ color: "#e1543a" }}
                  onClick={() => deleteItem(item.id)}
                />
              )}
            </a>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CartItem;
