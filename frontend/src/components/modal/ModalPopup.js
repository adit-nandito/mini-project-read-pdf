import React from "react";
import Modal from "react-modal";
import Button from "../button/Button";
import SuccessIcon from "../../assets/success.png";
import ErrorIcon from "../../assets/error.png";

Modal.setAppElement("#root");

function ModalPopup(props) {
  const { text, isModalOpen, setIsModalOpen, status, responseData } = props;
  let src = ErrorIcon;
  if (status === "success") {
    src = SuccessIcon;
  }

  const handleDownload = async (e) => {
    const byteNumbers = responseData.split(",");
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a link and trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "bukti-potong.pdf"; // Specify the file name
    document.body.appendChild(link);
    link.click();

    // Clean up and revoke the URL after downloading
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            height: "200px",
            width: "300px",
            placeContent: "center",
          },
        }}
      >
        <h2 style={{ textAlign: "center" }}>{text}</h2>
        <div style={{ textAlign: "center", paddingBottom: "15px" }}>
          <img
            style={{ height: "50px", width: "50px" }}
            src={src}
            alt={status}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {status === "success" && (
            <Button text="Download" onClick={handleDownload} />
          )}
          <Button text="Tutup" onClick={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default ModalPopup;
