import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { usePageData } from "./PageDataContext"; // Import the custom hook

function CartModal({ item }) {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [render, setRender] = useState(false);
  const { pageData, loading } = usePageData(); // Use the context

  useEffect(() => {
    qeen.bindClickEvents(
      [
        new qeen.InteractionEvent('ADD_TO_CART', '#add-to-cart'),
      ]
    );
  }, []);
  useEffect(() => {
    if(render){
    qeen.bindClickEvents(
      [
        new qeen.InteractionEvent('SUBMIT', '#submit')
      ]
    );
    setRender(false);
  }
  }, [render]);
  return (
    <>
      <Button
        id="add-to-cart"
        variant="dark"
        style={{ marginTop: "20px" }}
        onClick={() => {handleShow(); setRender(true);}}
      >
        Add to Cart
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title >Add to cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you like to add {pageData?.contentSelectors?.["#name"] || item.name} to cart ?
          <div className="d-flex mt-4 align-items-center">
            <Button
              className="d-flex justify-content-center align-items-center"
              style={{ height: "30px", width: "30px", borderRadius: "50%" }}
              variant="dark"
              onClick={() => {
                setQuantity(quantity + 1);
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
              }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            id="submit"
            variant="primary"
            onClick={() => {
              handleClose();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CartModal;
