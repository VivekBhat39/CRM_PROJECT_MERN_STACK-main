import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { PlusOutlined, PrinterOutlined } from "@ant-design/icons";
// -------------forPDF----------
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ComplaintReview() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [emp, setEmp] = useState([]);
  const [data, setData] = useState(null);
  const [newReview, setNewReview] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + "/employe").then((res) => {
      setEmp(res.data.data);
    });

    if (id) loadData();
  }, [id]);

  const loadData = () => {
    axios
      .get(import.meta.env.VITE_BASE_URL + `/complaint/${id}`)
      .then((res) => {
        setData(res.data.data);
      });

    axios
      .get(import.meta.env.VITE_BASE_URL + `/complaint_review/complaint/${id}`)
      .then((res) => {
        setNewReview(res.data.data);
      });
  };

  const handleSubmit = (values) => {
    const finalData = {
      ...values,
      complaint_id: id,
      date_time: values.date_time.format("YYYY-MM-DDTHH:mm"),
    };

    axios
      .post(import.meta.env.VITE_BASE_URL + "/complaint_review/", finalData)
      .then(() => {
        message.success("Review Added");
        setModalOpen(false);
        form.resetFields();
        loadData();
      });
  };

  // -------------forPDF------------

  function handlePrintPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Complaint Review Report", 105, 15, { align: "center" });

    //complaint details

    doc.setFontSize(12);

    const details = [
      ["Complaint", data.title],
      ["Description", data.description],
      ["Customer", data.customer_id?.name || ""],
      ["Employee", data.employee_id?.name || ""],
      ["Status", data.status],
    ];

    let y = 25;
    details.forEach(([label, value]) => {
      doc.text(`${label}:`, 14, y);
      doc.text(value, 50, y);
      y += 8;
    });

    //Review Table

    const headers = [["Sr. No.", "Date & Time", "Employee", "Review"]];

    const rows = newReview.map((item, i) => [
      i + 1,
      item.date_time,
      item.employee_id?.name || "",
      item.review,
    ]);

    autoTable(doc, {
      startY: y + 5,
      head: headers,
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    //Save
    const today = new Date().toISOString().split("T")[0];
    doc.save(`Complaint-Review-${today}.pdf`);
  }

  const columns = [
    { title: "Sr. No.", render: (_, __, i) => i + 1 },
    { title: "Date & Time", dataIndex: "date_time" },
    { title: "Employee", dataIndex: ["employee_id", "name"] },
    { title: "Review", dataIndex: "review" },
  ];

  if (!data) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Complaint Review</h2>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/complaint/complaints">Complaint</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Complaint Review</Breadcrumb.Item>
      </Breadcrumb>

      <Space
        style={{ float: "right" }}
        className="mb-5 ms-1 float-md-right me-2"
      >
        <Button icon={<PrinterOutlined />} onClick={handlePrintPDF}>
          Print
        </Button>
      </Space>
      <br />
      {/* Complaint Detail Card */}
      <Card className="mt-4 shadow-sm">
        <h5 className="text-primary mb-4">Complaint Details</h5>
        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Complaint:</div>
          <div className="col-sm-8">{data.title}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Complaint Description:</div>
          <div className="col-sm-8">{data.description}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Customer Name:</div>
          <div className="col-sm-8">{data.customer_id?.name || "—"}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Employee Name:</div>
          <div className="col-sm-8">{data.employee_id?.name || "—"}</div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-4 fw-bold">Status:</div>
          <div className="col-sm-8">
            <Tag
              color={
                data.status === "Pending"
                  ? "gold"
                  : data.status === "Resolved"
                  ? "green"
                  : data.status === "Rejected" || data.status === "Closed"
                  ? "red"
                  : "blue"
              }
            >
              {data.status}
            </Tag>
          </div>
        </div>
        <div className="d-flex justify-content-end me-5">
          <Button type="primary" onClick={() => setModalOpen(true)}>
            <PlusOutlined /> Add Review
          </Button>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        title="Add Review"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="date_time"
            label="Date & Time"
            rules={[{ required: true, message: "Please select date & time" }]}
          >
            <DatePicker showTime format="YYYY-MM-DDTHH:mm" className="w-100" />
          </Form.Item>

          <Form.Item
            name="employee_id"
            label="Employee"
            rules={[{ required: true, message: "Please select employee" }]}
          >
            <Select placeholder="Choose Employee">
              {emp.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="review"
            label="Review"
            rules={[{ required: true, message: "Please enter review" }]}
          >
            <Input.TextArea rows={4} placeholder="Review" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Choose Status">
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Resolved">Resolved</Select.Option>
              <Select.Option value="Closed">Closed</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Save Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Review Table */}
      <Card title="Review History" className="mt-5">
        <Table
          dataSource={newReview}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default ComplaintReview;
