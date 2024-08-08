import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const OrderItem = ({ order }) => {
  const date = new Date(order.date);
  const fullDate = `${date.getDay()} / ${date.getMonth()} / ${date.getFullYear()}`;
  return (
    <Card className="mb-3">
      <Card.Body>
        <h6>Date : {fullDate}</h6>
        <h6>Total : {order.total} JD</h6>
        {order.orderitem_set.map((item) => (
          <Row key={item.product.id} className="d-flex align-items-center">
            <Col className="d-flex align-items-center my-2">
              <Card.Img
                src={item.product.image}
                style={{ width: "40px" }}
                alt="Shopping item"
              />
              <h6 className="ms-3 mb-0"> {item.product.name} </h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center my-2">
              <h6 className="mb-0">{item.quantity}</h6>
            </Col>
            <Col className="d-flex justify-content-between align-items-center my-2">
              <h6 className="mb-0">
                {(item.product.price * item.quantity).toFixed(2)} JD
              </h6>
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
};

export default OrderItem;
