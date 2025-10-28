import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Select,
  Table,
  Tag,
  message,
  Space,
  Popconfirm,
  Breadcrumb,
  Dropdown,
  Menu,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  EllipsisOutlined,
  FileAddOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
//for pdf
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
//for excel
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;
const { RangePicker } = DatePicker;

function Complaints() {
  const navigate = useNavigate();
  const empIdRef = useRef(null);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [filters, setFilters] = useState({
    employee_id: "",
    customer_id: "",
    statuses: [],
    from_date: null,
    to_date: null,
  });

  const statuses = ["Pending", "In Progress", "Resolved", "Closed", "Rejected"];

  const fetchData = (customFilters = filters, page = currentPage) => {
    axios
      .get(import.meta.env.VITE_BASE_URL + "/complaint", {
        params: {
          employee_id: customFilters.employee_id,
          customer_id: customFilters.customer_id,
          statuses: customFilters.statuses.join(","),
          from_date: customFilters.from_date,
          to_date: customFilters.to_date,
          page,
          limit: pageSize,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.totalCount);
      })
      .catch(() => message.error("Failed to fetch complaints"));
  };

  useEffect(() => {
    const empId = localStorage.getItem("id");
    empIdRef.current = empId;
    axios
      .get(import.meta.env.VITE_BASE_URL + "/employe")
      .then((res) => setEmployees(res.data.data));
    axios
      .get(import.meta.env.VITE_BASE_URL + "/customer")
      .then((res) => setCustomers(res.data.data));

    const defaultFilters = {
      employee_id: empId || "",
      customer_id: "",
      statuses: [],
      from_date: null,
      to_date: null,
    };
    setFilters(defaultFilters);
    fetchData(defaultFilters, 1);
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(import.meta.env.VITE_BASE_URL + `/complaint/${id}`)
      .then(() => {
        message.success("Complaint deleted");
        fetchData(filters, currentPage);
      })
      .catch(() => message.error("Failed to delete"));
  };

  const resetFilters = () => {
    const cleared = {
      employee_id: empIdRef.current || "",
      customer_id: "",
      statuses: [],
      from_date: null,
      to_date: null,
    };
    setFilters(cleared);
    fetchData(cleared, 1);
    setCurrentPage(1);
  };

  //------------three dot for print and export excel ------------

  const exportMenu = (
    <Menu>
      <Menu.Item
        key="print"
        icon={<PrinterOutlined />}
        onClick={handleExportPDF}
      >
        Export to PDF
      </Menu.Item>
      <Menu.Item
        key="excel"
        icon={<FileAddOutlined />}
        onClick={handleExportExcel}
      >
        Export to Excel
      </Menu.Item>
    </Menu>
  );

  // /-----------for Print--------------/
  function handleExportPDF() {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth(); // page width in mm
    const centerX = pageWidth / 2;
    //Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Complaints Reports", centerX, 20, { align: "center" });

    //columns header
    const headers = [
      [
        "Sr.No.",
        "Title",
        "Date & Time",
        "Employee",
        "Customer",
        "Staus",
        "Review Count",
      ],
    ];

    //rows Data

    const rows = data.map((item, i) => [
      (currentPage - 1) * pageSize + i + 1,
      item.title,
      item.date_time,
      item.employee_id?.name || "",
      item.customer_id?.name || "",
      item.status,
      item.review_count,
    ]);

    //Auto table for data
    autoTable(doc, {
      startY: 30,
      head: headers,
      body: rows,

      //style
      theme: "grid",
      headStyles: {
        fillColor: [30, 144, 255], // DodgerBlue
        textColor: "#fff",
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        halign: "left",
      },
      styles: {
        cellPadding: 3,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 }, // Sr. No
        1: { cellWidth: 40 }, // Title
        2: { cellWidth: 35 }, // Date
        3: { cellWidth: 25 }, // Employee
        4: { cellWidth: 25 }, // Customer
        5: { halign: "center", cellWidth: 20 }, // Status
        6: { halign: "center", cellWidth: 20 }, // Review
      },
    });

    // // Save PDF with date
    const today = new Date().toISOString().split("T")[0];
    doc.save(`Complaint-Report-${today}.pdf`);
  }

  // /-----------for Excel--------------/

  function handleExportExcel() {
    //row formate for excel
    const rows = data.map((item, i) => ({
      "Sr.NO": (currentPage - 1) * pageSize + i + 1,
      Title: item.title,
      "Date & Time": item.date_time,
      Employee: item.employee_id?.name || "",
      Customer: item.customer_id?.name || "",
      Status: item.status,
      "Review Count": item.review_count,
    }));

    //conver to worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    //create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");

    //convert to binary and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    //File name with date
    const today = new Date().toISOString().split("T")[0];
    saveAs(fileData, `Complaint-Report-${today}.xlsx`);
  }

  // ----------------tabledata------------------

  const columns = [
    {
      title: "Sr. No.",
      render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (t, r) => (
        <a
          style={{
            color: "#1e90ff",
            fontWeight: "500",
            cursor: "pointer",
            fontSize: "15px",
          }}
          onClick={() => navigate(`/complaint/complaint-review/${r._id}`)}
        >
          {t}
        </a>
      ),
    },
    { title: "Date & Time", dataIndex: "date_time" },
    { title: "Employee", dataIndex: ["employee_id", "name"] },
    { title: "Customer", dataIndex: ["customer_id", "name"] },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => {
        const color =
          s === "Pending"
            ? "gold"
            : s === "Resolved"
            ? "green"
            : s === "Rejected" || s === "Closed"
            ? "red"
            : "blue";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Review Count",
      dataIndex: "review_count",
      align: "center",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => navigate(`/complaint/add-complaint/${record._id}`)}
          >
            <i className="fa-solid fa-pen-to-square" />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this complaint?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>
              <i className="fa-solid fa-trash-can" />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="mb-2">Complaints</h2>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/")}>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Complaints</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Space
        style={{ float: "right" }}
        className="mb-4 ms-1 float-md-right me-2"
      >
        <Button
          type="primary"
          size="large"
          icon={<FileAddOutlined />}
          onClick={() => navigate("/complaint/add-complaint")}
        >
          Add Complaint
        </Button>

        {/* -----------three dot---------- */}
        <Dropdown overlay={exportMenu} placement="bottomRight">
          <Button icon={<EllipsisOutlined />} size="large" />
        </Dropdown>
      </Space>

      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          showSearch
          optionFilterProp="children"
          placeholder="Search Employee"
          value={filters.employee_id || undefined}
          onChange={(v) => {
            const updated = { ...filters, employee_id: v };
            setFilters(updated);
            setCurrentPage(1);
            setTimeout(() => fetchData(updated, 1), 0);
          }}
          style={{ width: 200 }}
        >
          {employees.map((e) => (
            <Option key={e._id} value={e._id}>
              {e.name}
            </Option>
          ))}
        </Select>

        <Select
          showSearch
          optionFilterProp="children"
          placeholder="Search Customer"
          value={filters.customer_id || undefined}
          onChange={(v) => {
            const updated = { ...filters, customer_id: v };
            setFilters(updated);

            setCurrentPage(1);
            setTimeout(() => fetchData(updated, 1), 0);
          }}
          style={{ width: 200 }}
        >
          {customers.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.name}
            </Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Search Status"
          value={filters.statuses}
          onChange={(v) => {
            const updated = { ...filters, statuses: v };
            setFilters(updated);
            setCurrentPage(1);
            setTimeout(() => fetchData(updated, 1), 0);
          }}
          style={{ width: 200 }}
        >
          {statuses.map((s) => (
            <Option key={s}>{s}</Option>
          ))}
        </Select>

        <RangePicker
          onChange={(dates) => {
            const updated = {
              ...filters,
              from_date: dates?.[0]?.format("YYYY-MM-DD") || null,
              to_date: dates?.[1]?.format("YYYY-MM-DD") || null,
            };
            setFilters(updated);
            fetchData(updated, 1);
            setCurrentPage(1);
          }}
        />

        <Button danger onClick={resetFilters}>
          Reset
        </Button>
      </Space>
      <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
        * Click on the <strong>Complaint Title</strong> to view complaint
        details.
      </p>
      <Table
        className="custom-pagination"
        dataSource={data}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
            fetchData(filters, page);
          },
        }}
      />
    </div>
  );
}

export default Complaints;
