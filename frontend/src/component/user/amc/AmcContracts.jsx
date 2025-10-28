import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Button,
  Card,
  Table,
  Popconfirm,
  Space,
  Typography,
  Pagination,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

function AmcContracts() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const loadData = () => {
    axios
      .get(import.meta.env.VITE_BASE_URL + "/amcContracts", {
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

  const handleDelete = (id) => {
    axios
      .delete(import.meta.env.VITE_BASE_URL + `/amcContracts/${id}`)
      .then(() => {
        loadData();
      });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      width: "15%",
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      width: "15%",
    },
    {
      title: "Customer Name",
      dataIndex: ["customerid", "name"],
    },
    {
      title: "AMC Number",
      dataIndex: "ano",
      render: (ano, record) => (
        <span
          style={{ color: "#0d6efd", cursor: "pointer" }}
          onClick={() => navigate(`/amc/amc_print/${record._id}`)}
        >
          AMC-{ano}
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
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/amc/add-amc/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this Contract?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>

          {/* ✅ WhatsApp Share Button */}
          <Button
            type="default"
            icon={<WhatsAppOutlined style={{ color: "green" }} />}
            onClick={() => {
              const printUrl = `http://localhost:3000/amc/amc_print/${record._id}`;
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
      <h2 className="fw-bold mb-3 mt-3">AMC</h2>

      <Breadcrumb className="mb-3">
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>AMC Contracts</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-end mb-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/amc/add-amc")}
        >
          Add Contract
        </Button>
      </div>

      <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
        * Click on the <strong>AMC Number</strong> to view contract print.
      </p>

      <Card>
        <Table
          rowKey="_id"
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered
        />

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

export default AmcContracts;
