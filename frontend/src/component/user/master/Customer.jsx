import {
  Button,
  Form,
  Input,
  Table,
  Modal,
  message,
  Popconfirm,
  Row,
  Col,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

function Customer() {
  const [form] = Form.useForm();
  const [id, setId] = useState(undefined);
  const [newData, setNewData] = useState([]);
  const [serchName, setSerchName] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios.get(import.meta.env.VITE_BASE_URL + "/customer").then((res) => {
      setNewData(res.data.data);
    });
  };

  const filterData = newData.filter((customer) =>
    customer.name.toLowerCase().includes(serchName)
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!id) {
        await axios.post(import.meta.env.VITE_BASE_URL + "/customer", values);
        message.success("Customer added successfully");
      } else {
        await axios.put(
          import.meta.env.VITE_BASE_URL + "/customer/" + id,
          values
        );
        message.success("Customer updated successfully");
      }
      form.resetFields();
      setId(undefined);
      loadData();
    } catch (error) {
      console.log("Validation Error", error);
    }
  };

  const handleEmpDelete = (id) => {
    axios.delete(import.meta.env.VITE_BASE_URL + "/customer/" + id).then(() => {
      message.success("Customer deleted");
      loadData();
    });
  };

  const handleEmpEdit = (id) => {
    setId(id);
    axios.get(import.meta.env.VITE_BASE_URL + "/customer/" + id).then((res) => {
      form.setFieldsValue(res.data.data);
    });
  };

  //import customer from excel
  async function handleExcelUpload() {
    if (!excelFile) return;

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const res = await axios.post(
          import.meta.env.VITE_BASE_URL + "/customer/bulk",
          data
        );
        if (res.data.status === "success") {
          message.success("Customers imported successfully!");
          setExcelFile(null); // reset file
          loadData();
        } else {
          message.error("Failed to import customers.");
        }
      };
      reader.readAsBinaryString(excelFile);
    } catch (error) {
      console.log(error);
      message.error("Error uploading file.");
    }
  }

  // Table columns
  const columns = [
    {
      title: "Sr. No.",
      render: (_, __, i) => i + 1,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEmpEdit(record._id)}
            className="me-2"
            icon={<i className="fa-solid fa-user-pen" />}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleEmpDelete(record._id)}
          >
            <Button danger icon={<i className="fa-solid fa-user-minus" />} />
          </Popconfirm>
        </>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <div className="pagetitle mt-3">
        <h1>Add Customer</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="breadcrumb-item active">Customer</li>
          </ol>
        </nav>
      </div>

      <div className="card p-4 mt-3">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="row"
        >
          <div className="col-md-6">
            <Form.Item
              style={{ fontWeight: "bold" }}
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Name" size="large" />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              style={{ fontWeight: "bold" }}
              label="Contact Person"
              name="contactPerson"
              rules={[
                { required: true, message: "Please enter contact person name" },
              ]}
            >
              <Input placeholder="Contact Person" size="large" />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              style={{ fontWeight: "bold" }}
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item
              style={{ fontWeight: "bold" }}
              label="Mobile"
              name="mobile"
              rules={[
                { required: true, message: "Enter mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter valid 10-digit number",
                },
              ]}
            >
              <Input placeholder="Mobile Number" size="large" />
            </Form.Item>
          </div>

          <div className="col-12">
            <Form.Item
              style={{ fontWeight: "bold" }}
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input.TextArea rows={3} placeholder="Address" />
            </Form.Item>
          </div>

          <div className="text-center">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {id ? "Update" : "Submit"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      <Row className="mb-3">
        <Col span={8}>
          <Input.Search
            placeholder="Search customers by name"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSerchName(e.target.value.toLowerCase())}
            style={{ borderRadius: "8px" }}
          />
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setExcelFile(e.target.files[0])}
            className="form-control"
          />
          <Button
            type="primary"
            className="mt-2"
            onClick={handleExcelUpload}
            disabled={!excelFile}
          >
            Upload
          </Button>
        </Col>
      </Row>

      <div className="card mt-4">
        <div className="card-body mt-4">
          <Table
            className="custom-pagination"
            dataSource={filterData}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </>
  );
}

export default Customer;
