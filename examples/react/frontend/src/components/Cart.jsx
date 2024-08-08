import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CartItem from "./CartItem";

const Cart = () => {
  const items = [];
  const calctotal = () => {
    let total = 0;
    items.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  };

  useEffect(() => {
    qeen.bindClickEvents([new qeen.InteractionEvent("CHECKOUT", "#checkout")]);
  }, []);

  return (
    <section
      className="h-100 h-custom"
      style={{ backgroundColor: "#eee", minHeight: "calc(100vh - 45px)" }}
    >
      <Container className="py-5 h-100">
        <Row
          style={{ minWidth: "400px" }}
          className="justify-content-center align-items-center h-100"
        >
          <Col>
            <Card>
              <Card.Body className="p-4">
                <Row>
                  <Col lg="7">
                    <h5>
                      <a
                        href="#!"
                        className="text-body"
                        style={{ textDecoration: "none" }}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Continue shopping
                      </a>
                    </h5>
                    <h5>Total: {calctotal().toFixed(2)} JD</h5>
                    <hr />

                    <p className="mb-1">Shopping cart</p>
                    <p className="mb-4">
                      You have {items.length} items in your cart
                    </p>
                    <button id="checkout" className="btn btn-success">
                      Checkout
                    </button>
                    {items.map((item) => (
                      <CartItem
                        item={item}
                      />
                    ))}
                  </Col>
                </Row>{" "}
                {/* cart body */}
                {items.length ? (
                  <Row className="d-flex justify-content-center px-3 col-md-6">
                    <Button variant="success" onClick={createOrder}>
                      create order
                    </Button>
                  </Row>
                ) : (
                  <></>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Cart;
