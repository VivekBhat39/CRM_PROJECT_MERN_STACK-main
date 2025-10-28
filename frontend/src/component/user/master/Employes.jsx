import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Table,
  Popconfirm,
  Modal,
} from "antd";

function Employes() {
  const [form] = Form.useForm();
  const [newData, setNewData] = useState([]);
  const [id, setId] = useState(undefined);
  const [role, setRole] = useState([]);

  // Load data from backend
  useEffect(() => {
    loadData();
    axios.get(import.meta.env.VITE_BASE_URL + "/role").then((res) => {
      setRole(res.data.data);
    });
  }, []);

  function loadData() {
    axios.get(import.meta.env.VITE_BASE_URL + "/employe").then((res) => {
      setNewData(res.data.data);
    });
  }

  function handleEmpDelete(id) {
    Modal.confirm({
      title: "Are you sure you want to delete this employee?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        axios
          .delete(import.meta.env.VITE_BASE_URL + "/employe/" + id)
          .then(() => {
            message.success("Employee deleted");
            loadData();
          });
      },
    });
  }

  function handleEmpEdit(id) {
    setId(id);
    axios.get(import.meta.env.VITE_BASE_URL + "/employe/" + id).then((res) => {
      const { name, gender, email, mobile, address, role_id, password } =
        res.data.data;
      // console.log(res.data.data);

      form.setFieldsValue({
        name,
        gender,
        email,
        mobile,
        address,
        role_id: role_id?._id || null,
        password,
      });
    });
  }

  const handleEmpSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (id === undefined) {
        axios
          .post(import.meta.env.VITE_BASE_URL + "/employe", values)
          .then(() => {
            message.success("Employee added successfully");
            loadData();
          });
      } else {
        axios
          .put(import.meta.env.VITE_BASE_URL + "/employe/" + id, values)
          .then(() => {
            message.success("Employee updated successfully");
            loadData();
            setId(undefined);
          });
      }

      form.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  // Define AntD table columns
  const columns = [
    {
      title: "Sr. No.",
      key: "srno",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Role",
      dataIndex: ["role_id", "role"],
      key: "role_id",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            className="me-2"
            onClick={() => handleEmpEdit(record._id)}
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
    },
  ];

  return (
    <>
      <div className="pagetitle mt-3">
        <h1>Add Employee</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="breadcrumb-item active">Employees</li>
          </ol>
        </nav>
      </div>

      <div className="card p-4 mt-3">
        {/* Form Start */}
        <Form form={form} layout="vertical" onFinish={handleEmpSubmit}>
          <div className="row">
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
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select placeholder="Choose Gender" size="large">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                style={{ fontWeight: "bold" }}
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Email" size="large" allowClear />
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                style={{ fontWeight: "bold" }}
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  placeholder="Password"
                  size="large"
                  allowClear
                />
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
                    message: "Enter valid 10-digit mobile number",
                  },
                ]}
              >
                <Input placeholder="Mobile Number" size="large" />
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                style={{ fontWeight: "bold" }}
                label="Role"
                name="role_id"
                rules={[{ required: true, message: "Please select role" }]}
              >
                <Select placeholder="Select Role" showSearch size="large">
                  {role.map((eachData) => (
                    <Select.Option key={eachData._id} value={eachData._id}>
                      {eachData.role}
                    </Select.Option>
                  ))}
                </Select>
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
          </div>
        </Form>
      </div>

      {/* Table */}
      <div className="card mt-4">
        <div className="card-body mt-4">
          <Table
            dataSource={newData}
            columns={columns}
            bordered
            rowKey="_id"
            pagination={false}
          />
        </div>
      </div>
    </>
  );
}

export default Employes;
