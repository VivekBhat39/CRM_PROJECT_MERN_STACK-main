import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Table,
  Pagination,
  Space,
  message,
  Popconfirm,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

function Quotations() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Fetch quotations with pagination
  const loadData = () => {
    axios
      .get(import.meta.env.VITE_BASE_URL + "/quotations", {
        params: { page, limit },
      })
      .then((res) => {
        const resData = res.data.data || [];
        setData(resData);
        setTotalCount(res.data.total || resData.length);

        if (page > 1 && resData.length === 0) {
          setPage((prev) => prev - 1);
        }
      })
      .catch((err) => {
        message.error("Failed to load quotations");
        console.error("Fetch error:", err);
      });
  };

  useEffect(() => {
    loadData();
  }, [page]);

  // Delete a quotation
  const handleDelete = (id) => {
    axios
      .delete(import.meta.env.VITE_BASE_URL + `/quotations/${id}`)
      .then(() => {
        message.success("Quotation deleted successfully");
        loadData();
      })
      .catch(() => {
        message.error("Failed to delete quotation");
      });
  };

  // Table Columns
  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, __, i) => (page - 1) * limit + i + 1,
    },
    {
      title: "Date",
      dataIndex: "qdate",
      key: "qdate",
    },
    {
      title: "Customer Name",
      dataIndex: ["customerid", "name"],
      key: "customerid",
    },
    {
      title: "Quotation Number",
      dataIndex: "qno",
      key: "qno",
      render: (qno, record) => (
        <span
          style={{ color: "#1677ff", cursor: "pointer" }}
          onClick={() => navigate(`/quotation/quotation_print/${record._id}`)}
        >
          QTN-{qno}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => navigate(`/quotation/add-quotaion/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this quotation?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>

          {/* ✅ WhatsApp Share Button */}
          <Button
            type="default"
            icon={<WhatsAppOutlined style={{ color: "green" }} />}
            onClick={() => {
              const printUrl = `http://localhost:3000/quotation/quotation_print/${record._id}`;
              const message = `Please check this AMC Contract:\n${printUrl}`;
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                message
              )}`;
              window.open(whatsappUrl, "_blank");
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={4} className="fw-bold mb-3 mt-3">
        Quotations
      </Title>

      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Quotations</Breadcrumb.Item>
      </Breadcrumb>

      {/* Add Button */}
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/quotation/add-quotaion")}
        >
          Add Quotation
        </Button>
      </div>
      <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
        * Click on the <strong>Quotation Number</strong> to view Quotation
        print.
      </p>

      {/* Table & Pagination */}
      <Card>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />

        {/* Centered Pagination */}
        <Pagination
          style={{ marginTop: 24, display: "flex", justifyContent: "center" }}
          current={page}
          pageSize={limit}
          total={totalCount}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </Card>
    </>
  );
}

export default Quotations;
