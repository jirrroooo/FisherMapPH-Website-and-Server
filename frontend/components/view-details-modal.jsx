import React, { useState } from "react";

// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useUserDataStore } from "../store/userDataStore";

export default function ViewDetailsModal({data, isOpen}) {
  const [modalOpen, setModalOpen] = useState(isOpen);

  return (
    <>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title" id="exampleModalLabel">
            Modal title
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => {
                setModalOpen(!modalOpen);
                useUserDataStore.setState({isViewModal: false});
            }}
          >
            <span aria-hidden={true}>&times;</span>
          </button>
        </div>
        <ModalBody>...</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => {
                setModalOpen(!modalOpen);
                useUserDataStore.setState({isViewModal: false});
            }}
          >
            Close
          </Button>
          <Button color="primary" type="button">
            Save changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
