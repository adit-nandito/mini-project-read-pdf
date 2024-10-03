import React, { useState } from "react";
import axios from "axios";
import ModalPopup from "../../components/modal/ModalPopup";
import Loading from "../../components/loading/Loading";
import Button from "../../components/button/Button";

function FormUploadFile() {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [responseData, setResponseData] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("file", file); // Append the file
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/pdf/v1/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { pdfFile } = response.data;

      setLoading(false);
      setStatus("success");
      setResponseData(pdfFile);
      setIsModalOpen(true);
      setText("Sukses Upload File");
      setFile(null);
    } catch (err) {
      setStatus("error");
      setLoading(false);
      setIsModalOpen(true);
      setText("Gagal Upload File");
      setFile(null);
      console.error("Error uploading pdf:", err);
    }
  };

  const generateLayoutFormUploadFile = () => {
    if (isLoading) {
      return <Loading />;
    }

    return (
      <div>
        <ModalPopup
          text={text}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          status={status}
          responseData={responseData}
        />
        <h2>Upload PDF File</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            type="file"
            onChange={handleFileUpload}
            accept="application/pdf"
            style={{ marginBottom: "10px" }}
          />
          <Button
            text="Upload"
            onClick={handleSubmit}
            type="submit"
            disabled={file ? false : true}
          />
        </form>
      </div>
    );
  };

  return generateLayoutFormUploadFile();
}

export default FormUploadFile;
