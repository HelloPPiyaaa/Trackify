import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import type { Issue } from "./types";

interface EditStatusModalProps {
  issue: Issue;
  access_token: string | null;
  onClose: () => void;
  onSave: (updatedIssue: Issue) => void;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({
  issue,
  access_token,
  onClose,
  onSave,
}) => {
  const [newStatus, setNewStatus] = useState(issue.status);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/issues/${issue._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select
          value={newStatus}
          onChange={(e) =>
            setNewStatus(e.target.value as "Open" | "InProgress" | "Done")
          }
        >
          <option value="Open">Open</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStatusModal;
