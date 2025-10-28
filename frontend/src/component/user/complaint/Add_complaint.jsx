import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { TextArea } = Input;

function AddComplaint() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + "/employe").then((res) => {
      setEmployees(res.data.data);
    });
    axios.get(import.meta.env.VITE_BASE_URL + "/customer").then((res) => {
      setCustomers(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(import.meta.env.VITE_BASE_URL + "/complaint/" + id)
        .then((res) => {
          const data = res.data.data;
          form.setFieldsValue({
            title: data.title,
            date_time: dayjs(data.date_time),
            employee_id: data.employee_id?._id,
            customer_id: data.customer_id?._id,
            status: data.status,
            description: data.description,
          });
        });
    }
  }, [id]);

  const onFinish = (values) => {
    const payload = {
      ...values,
      date_time: values.date_time.format("YYYY-MM-DDTHH:mm"),
    };

    if (id) {
      axios
        .put(import.meta.env.VITE_BASE_URL + "/complaint/" + id, payload)
        .then(() => {
          message.success("Complaint updated successfully");
          navigate("/complaint/complaints");
        });
    } else {
      axios
        .post(import.meta.env.VITE_BASE_URL + "/complaint", payload)
        .then(() => {
          message.success("Complaint added successfully");
          navigate("/complaint/complaints");
        });
    }
  };

  return (
    <>
      <div className="pagetitle mt-3">
        <h1>Add Complaint</h1>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/complaint/complaints">Complaint</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add Complaint</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card className="mt-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="row g-3"
        >
          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Date & Time"
            name="date_time"
            className="col-md-6"
            rules={[{ required: true, message: "Please select date & time" }]}
          >
            <DatePicker showTime format="YYYY-MM-DDTHH:mm" className="w-100" />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Customer"
            name="customer_id"
            className="col-md-6"
            rules={[{ required: true, message: "Please select a customer" }]}
          >
            <Select placeholder="Choose Customer">
              {customers.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Title"
            name="title"
            className="col-md-6"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Employee"
            name="employee_id"
            className="col-md-6"
            rules={[{ required: true, message: "Please select an employee" }]}
          >
            <Select placeholder="Choose Employee">
              {employees.map((e) => (
                <Select.Option key={e._id} value={e._id}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Status"
            name="status"
            className="col-md-6"
            initialValue="Pending"
          >
            <Select disabled>
              <Select.Option value="Pending">Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Description"
            name="description"
            className="col-12"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Description" />
          </Form.Item>

          <Form.Item className="text-center col-12">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default AddComplaint;
