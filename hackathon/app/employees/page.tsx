"use client";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "@/scss/employee.scss";
import axios from "axios";
import { format } from "date-fns";

interface Employees {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

function validateEmail(email: any) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export default function route() {
  const [employees, setEmployee] = useState<Employees[]>([]);
  const [deleteEmployee, setDeleteEmployee] = useState<Employees | null>(null);
  const [selected, setSelected] = useState<Employees | null>(null);
  const [inputValue, setInputValue] = useState<Employees>({
    id: 0,
    employeeName: "",
    dateOfBirth: "",
    image: "",
    email: "",
  });

  const [error, setError] = useState({
    employeeName: "",
    dateOfBirth: "",
    image: "",
    email: "",
  });

  useEffect(() => {
    let data = axios.get("http://localhost:3000/api/employees");
    data.then((res) => setEmployee(res.data)).catch((err) => console.log(err));
  }, []);

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => {
    setShow(false),
      setError({
        employeeName: "",
        dateOfBirth: "",
        image: "",
        email: "",
      });
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
  };
  const handleShow = () => setShow(true);
  const handleShowEdit = (id: number) => {
    const showInfo = employees.find(
      (employee: Employees) => employee.id === id
    );
    if (showInfo) {
      setSelected(showInfo);
      setShowEdit(true);
    }
  };

  // Hàm thêm mới nhân viên
  const handleAdd = async () => {
    let valid = true;
    if (!inputValue.employeeName) {
      error.employeeName = "Tên không được để trống";
      valid = false;
    } else {
      error.employeeName = "";
    }

    if (!inputValue.dateOfBirth) {
      error.dateOfBirth = "Ngày sinh không được để trống";
      valid = false;
    } else {
      error.dateOfBirth = "";
    }

    if (!inputValue.image) {
      error.image = "Vui lòng nhập đường dẫn hình ảnh";
      valid = false;
    } else {
      error.image = "";
    }

    if (!inputValue.email) {
      error.email = "Email không được để trống";
      valid = false;
    } else if (!validateEmail(inputValue.email)) {
      error.email = "Email không hợp lệ";
      valid = false;
    } else if (
      employees.some((exist: any) => exist.email === inputValue.email)
    ) {
      error.email = "Email đã tồn tại";
      valid = false;
    } else {
      error.email = "";
    }

    setError({ ...error });

    if (valid) {
      const newEmployee = {
        id: Math.ceil(Math.random() * 10000),
        employeeName: inputValue.employeeName,
        dateOfBirth: inputValue.dateOfBirth,
        image: inputValue.image,
        email: inputValue.email,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/api/employees",
          newEmployee
        );
        const updatedData = await axios.get(
          "http://localhost:3000/api/employees"
        );
        setEmployee(updatedData.data);
        setShow(false);
        setInputValue({
          id: 0,
          employeeName: "",
          dateOfBirth: "",
          image: "",
          email: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  // Hàm cập nhật thông tin nhân viên
  const handleUpdate = async () => {
    let valid = true;

    // Perform the same validation as in handleAdd
    if (!selected?.employeeName) {
      error.employeeName = "Tên không được để trống";
      valid = false;
    } else {
      error.employeeName = "";
    }

    if (!selected?.dateOfBirth) {
      error.dateOfBirth = "Ngày sinh không được để trống";
      valid = false;
    } else {
      error.dateOfBirth = "";
    }

    if (!selected?.image) {
      error.image = "Vui lòng nhập đường dẫn hình ảnh";
      valid = false;
    } else {
      error.image = "";
    }

    if (!selected?.email) {
      error.email = "Email không được để trống";
      valid = false;
    } else if (!validateEmail(selected.email)) {
      error.email = "Email không hợp lệ";
      valid = false;
    } else {
      error.email = "";
    }

    setError({ ...error });

    if (valid && selected) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/employees/${selected.id}`,
          selected
        );
        const updatedData = await axios.get(
          "http://localhost:3000/api/employees"
        );
        setEmployee(updatedData.data);
        setShowEdit(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selected) {
      setSelected({
        ...selected,
        [name]: value,
      });
    }
  };

  // Hàm xóa nhân viên
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/employees/${id}`);
      setEmployee(employees.filter((employee) => employee.id !== id));
      setDeleteEmployee(null);
    } catch (error) {
      console.log("Error deleting employee:", error);
    }
  };

  return (
    <div className="table-wrapper">
      <div className="title">
        <h3>Quản lí sinh viên</h3>
        <Button variant="primary" onClick={handleShow}>
          Thêm mới nhân viên
        </Button>
      </div>
      <br />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên nhân viên</th>
              <th>Ngày sinh</th>
              <th>Hình ảnh</th>
              <th>Email</th>
              <th className="w-52">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee: Employees, index: number) => (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td>{employee.employeeName}</td>
                <td>{format(employee.dateOfBirth, "dd/MM/yyyy")}</td>
                <td>
                  <img src={employee.image} alt="" />
                </td>
                <td>{employee.email}</td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleShowEdit(employee.id)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteEmployee(employee)}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteEmployee && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i
                className="fas fa-xmark"
                onClick={() => setDeleteEmployee(null)}
              />
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa {deleteEmployee?.employeeName}?</p>
            </div>
            <div className="modal-footer-footer">
              <button
                className="btn btn-light"
                onClick={() => setDeleteEmployee(null)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteEmployee?.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên nhân viên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên"
                onChange={handleChange}
                name="employeeName"
              />
              {error.employeeName && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.employeeName}
                </span>
              )}
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                onChange={handleChange}
                name="dateOfBirth"
              />
              {error.dateOfBirth && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.dateOfBirth}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập hình ảnh"
                onChange={handleChange}
                name="image"
              />
              {error.image && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.image}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập email"
                onChange={handleChange}
                name="email"
              />
              {error.email && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.email}
                </span>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên nhân viên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên"
                onChange={handleEditChange}
                name="employeeName"
                value={selected?.employeeName}
              />
              {error.employeeName && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.employeeName}
                </span>
              )}
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                onChange={handleEditChange}
                name="dateOfBirth"
                value={selected?.dateOfBirth}
              />
              {error.dateOfBirth && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.dateOfBirth}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập hình ảnh"
                onChange={handleEditChange}
                name="image"
                value={selected?.image}
              />
              {error.image && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.image}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập email"
                onChange={handleEditChange}
                name="email"
                value={selected?.email}
              />
              {error.email && (
                <span style={{ color: "red", fontSize: 14 }}>
                  {error.email}
                </span>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
