import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  Col,
  Row,
  Statistic,
  Button,
  Tag,
  Typography,
  Empty,
  Table,
  Space,
} from "antd";
import {
  PlusOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  FileTextOutlined,
  ToolOutlined,
} from "@ant-design/icons";

// Chart.js ko register karna zaroori hota hai
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

const cardStyles = {
  borderRadius: "16px",
  height: "120px",
  display: "flex",
  alignItems: "center",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "0.3s",
};

const iconStyles = {
  fontSize: "30px",
  padding: "16px",
  borderRadius: "50%",
  marginRight: "16px",
  color: "#fff",
};

const cardColors = {
  employee: { bg: "#1890ff", iconBg: "#40a9ff" },
  customer: { bg: "#faad14", iconBg: "#ffc53d" },
  quotation: { bg: "#52c41a", iconBg: "#73d13d" },
  amc: { bg: "#9254de", iconBg: "#b37feb" },
};

function Dashboard() {
  const [counts, setCounts] = useState({
    employee: 0,
    customer: 0,
    complaint: 0,
    quotation: 0,
    amc: 0,
    complaintStatus: {},
  });

  const [chartData, setChartData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topQuotations, setTopQuotations] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [emp, cust, comp, quot, amc, topCust, topQuots] = await Promise.all(
        [
          axios.get("http://localhost:8080/dashboard/total-employees"),
          axios.get("http://localhost:8080/dashboard/total-customer"),
          axios.get("http://localhost:8080/dashboard/complaint-summary"),
          axios.get("http://localhost:8080/dashboard/quotation-total"),
          axios.get("http://localhost:8080/dashboard/amc-total"),
          axios.get("http://localhost:8080/dashboard/top-customers"),
          axios.get("http://localhost:8080/dashboard/top-quotations"),
        ]
      );

      setCounts({
        employee: emp.data.data,
        customer: cust.data.data,
        complaint: comp.data.total,
        quotation: quot.data.data,
        amc: amc.data.data,
        complaintStatus: comp.data.statusSummary || {},
      });

      setTopCustomers(topCust.data.data || []);
      setTopQuotations(topQuots.data.data || []);

      const chartRes = await axios.get(
        "http://localhost:8080/dashboard/complaints-by-date"
      );
      const apiData = chartRes.data.data || [];

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const fullMonthDates = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const formatted = date.toISOString().split("T")[0];
        fullMonthDates.push(formatted);
      }

      const dateCountMap = {};
      apiData.forEach((item) => {
        dateCountMap[item._id] = item.count;
      });

      const completeChartData = fullMonthDates.map((date) => ({
        _id: date,
        count: dateCountMap[date] || 0,
      }));

      setChartData(completeChartData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lineData = {
    labels: chartData.map((item) => item._id),
    datasets: [
      {
        label: "Complaints",
        data: chartData.map((item) => item.count),
        fill: true,
        backgroundColor: "rgba(0,123,255,0.2)",
        borderColor: "#007bff",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(counts.complaintStatus),
    datasets: [
      {
        label: "Complaint Status",
        data: Object.values(counts.complaintStatus),
        backgroundColor: [
          "#f57a7aff",
          "#cff10bff",
          "#ffc107",
          "#28a745",
          "#b817a3ff",
        ],
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Date-wise Complaint Chart",
      },
      legend: { display: false },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <UserOutlined /> {text}
        </Space>
      ),
    },
    {
      title: "Total Quotations",
      dataIndex: "quotationCount",
      key: "quotationCount",
    },
  ];

  //define color based on status

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "resolved":
        return "green";
      case "in progress":
        return "blue";
      case "rejected":
        return "red";
      default:
        return "grey";
    }
  };

  return (
    <div className="p-4">
      <AntTitle
        level={3}
        className="text-center mb-4"
        style={{
          fontWeight: "bold",
          fontSize: "38px",
          color: "#1f1f1f",
          letterSpacing: "1px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        📊 Business Intelligence Dashboard
      </AntTitle>

      <Row gutter={[16, 16]} className="mb-4 ">
        <DashboardCard
          title="Employees"
          count={counts.employee}
          icon={<UserOutlined />}
          color={cardColors.employee}
          onClick={() => {
            navigate("/master/employes");
          }}
        />
        <DashboardCard
          title="Customers"
          count={counts.customer}
          icon={<TeamOutlined />}
          color={cardColors.customer}
          onClick={() => {
            navigate("/master/customer");
          }}
        />
        <DashboardCard
          title="Quotations"
          count={counts.quotation}
          icon={<FileTextOutlined />}
          color={cardColors.quotation}
          onClick={() => {
            navigate("/quotation/quotations");
          }}
        />
        <DashboardCard
          title="AMCs"
          count={counts.amc}
          icon={<ToolOutlined />}
          color={cardColors.amc}
          onClick={() => {
            navigate("/amc/add-amc");
          }}
        />
      </Row>

      <Card
        title={
          <span>
            <ExclamationCircleOutlined className="me-2" /> Complaints Summary
          </span>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/complaint/add-complaint")}
            >
              Add Complaint
            </Button>
          </Space>
        }
        className="mb-4 mt-4"
      >
        <Row gutter={[16, 16]} className="mb-3">
          <Col span={6}>
            <Statistic title="Total Complaints" value={counts.complaint} />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {Object.entries(counts.complaintStatus).length > 0 ? (
            Object.entries(counts.complaintStatus).map(([status, value]) => (
              <Col span={8} key={status}>
                <Card bordered>
                  <Tag color={getStatusColor(status)} className="mb-2">
                    {status}
                  </Tag>
                  <Statistic value={value} />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} className="text-center">
              <Empty description="No complaint status available." />
            </Col>
          )}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            title={
              <span>
                <BarChartOutlined className="me-2" /> Date-wise Complaints
              </span>
            }
          >
            {chartData.length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <Empty description="No data" />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Complaint Status Distribution (Pie)">
            {Object.keys(counts.complaintStatus).length > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <Empty description="No status data" />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Top 5 Quotations Sent" className="mt-4">
        <Table
          columns={[
            {
              title: "Quotation No",
              dataIndex: "qno",
              key: "qno",
            },
            {
              title: "Customer",
              dataIndex: "customername",
              key: "customername",
            },
            {
              title: "Date",
              dataIndex: "qdate",
              key: "qdate",
              render: (date) => new Date(date).toLocaleDateString(),
            },
            {
              title: "Total",
              dataIndex: "total",
              key: "total",
            },
          ]}
          dataSource={topQuotations}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

function DashboardCard({ title, count, color, icon, onClick }) {
  return (
    <Col xs={24} sm={12} md={6} lg={6}>
      <Card
        style={{
          marginTop: "40px",
          ...cardStyles,
          backgroundColor: color.bg,
        }}
        hoverable
        bordered={false}
        onClick={onClick}
      >
        <div style={{ ...iconStyles, backgroundColor: color.iconBg }}>
          {icon}
        </div>
        <div>
          <Typography.Title
            level={5}
            style={{ margin: 0, color: "#fff", fontSize: "18px" }}
          >
            {title}
          </Typography.Title>
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              color: "#fff",
              marginBottom: "40px",
              fontSize: "40px",
            }}
            className="ms-4"
          >
            {count}
          </Typography.Title>
        </div>
      </Card>
    </Col>
  );
}

export default Dashboard;
