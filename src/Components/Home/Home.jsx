import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Form, Button, Table, Modal } from "react-bootstrap";
import {
  addExpense,
  handleDeleteExpense,
  setExpenses,
} from "../../Store/Slices/ExpenseSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const UserMail = localStorage.getItem("userName");
  const API = `https://expense-tracker-6667c-default-rtdb.firebaseio.com/${UserMail}`;

  const isLogin = useSelector((state) => state.auth.isLogin);
  const expenses = useSelector((state) => state.expense);
  const [moneySpent, setMoneySpent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const totalExpenses = expenses
    .reduce((total, expense) => total + parseFloat(expense.moneySpent), 0)
    .toFixed(2);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (moneySpent && description && category) {
      const newExpense = {
        id: expenses.length + 1,
        moneySpent,
        description,
        category,
      };
      try {
        const totalAmount = expenses.reduce(
          (total, expense) => total + parseFloat(expense.moneySpent),
          parseFloat(moneySpent)
        );
        if (totalAmount > 10000) {
          setShowModal(true);
          toast.warning("Expense not added. Total expenses would exceed 10000");
        } else {
          const response = await axios.post(`${API}.json`, newExpense);
          if (response.status === 200) {
            dispatch(addExpense(newExpense));
            toast.success("Expense Added");
          } else {
            toast.error("Expense not added");
          }
        }
      } catch (error) {
        console.log(error);
      }
      setMoneySpent("");
      setDescription("");
      setCategory("");
    } else {
      toast.error("Fill all fields");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setMoneySpent(expense.moneySpent);
    setDescription(expense.description);
    setCategory(expense.category);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMoneySpent("");
    setDescription("");
    setCategory("");
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    if (moneySpent && description && category) {
      const updatedExpense = {
        id: editingId,
        moneySpent,
        description,
        category,
      };
      try {
        const res = await axios(`${API}.json`);
        const data = res.data;
        const id = editingId;
        if (data) {
          const totalExpenses = expenses.reduce(
            (total, expense) => total + parseFloat(expense.moneySpent),
            0
          );
          if (totalExpenses + parseFloat(moneySpent) > 10000) {
            toast.error("Total expenses cannot exceed 10000");
          } else {
            for (let key in data) {
              if (data[key].id === id) {
                const response = await axios.put(
                  `${API}/${key}.json`,
                  updatedExpense
                );
                console.log(response);
                if (response.status === 200) {
                  const updatedExpenses = expenses.map((item) => {
                    if (item.id === id) {
                      return { ...item, ...updatedExpense };
                    }
                    return item;
                  });
                  dispatch(setExpenses(updatedExpenses));
                  toast.success("Expense Updated");
                }
              }
            }
          }
        }
      } catch (error) {
        toast.error("Error updating expense");
      }
      setEditingId(null);
      setMoneySpent("");
      setDescription("");
      setCategory("");
    } else {
      toast.error("Fill all fields");
    }
  };

  const deleteExpense = async (id) => {
    const res = await axios(`${API}.json`);
    const data = res.data;

    if (data) {
      for (let key in data) {
        if (data[key].id === id) {
          const response = await axios.delete(`${API}/${key}.json`);
          if (response.status === 200) {
            dispatch(handleDeleteExpense(id));
            toast.success("Expense Deleted");
          }
        }
      }
    }
  };

  const handleDownloadExpenses = () => {
    const csvData = expenses.map((expense) => ({
      id: expense.id,
      category: expense.category,
      description: expense.description,
      moneySpent: expense.moneySpent,
    }));

    return csvData;
  };

  if (!isLogin) {
    return <div className="text-center fs-5">Welcome To Expense Tracker</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Expense Tracker</h2>

      {!editingId ? (
        <Form onSubmit={handleAddExpense} className="mt-4">
          <div className="row">
            <div className="col-md-4">
              <Form.Group controlId="moneySpent">
                <Form.Label>Money Spent</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={moneySpent}
                  onChange={(e) => setMoneySpent(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                </Form.Control>
              </Form.Group>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button variant="primary" type="submit">
              Add Expense
            </Button>
          </div>
        </Form>
      ) : (
        <Form onSubmit={handleUpdateExpense} className="mt-4">
          <div className="row">
            <div className="col-md-4">
              <Form.Group controlId="moneySpent">
                <Form.Label>Money Spent</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={moneySpent}
                  onChange={(e) => setMoneySpent(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                </Form.Control>
              </Form.Group>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button variant="primary" type="submit">
              Update Expense
            </Button>{" "}
            <Button variant="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </Form>
      )}

      {expenses.length > 0 && (
        <>
        <div className="d-flex justify-content-between">
          <h3>Expenses:</h3>
          <div className="download-button">
              <CSVLink
                data={handleDownloadExpenses()}
                filename="expenses.csv"
                className="btn btn-success"
              >
                Download Expenses as CSV
              </CSVLink>
            </div>
            </div>
          <div
            className="mt-4 expenses-container"
            style={{ height: "50vh", overflowY: "auto" }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Money Spent</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.id}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>{expense.moneySpent}</td>
                    <td>
                      {!editingId || editingId !== expense.id ? (
                        <Button
                          variant="info"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </Button>
                      ) : null}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {expenses.length > 0 && (
        <div className="mt-4 d-flex justify-content-end">
          <div className="total-expenses">
            <h4>Total Expenses:</h4>
            <p className="total-amount">Total Amount: ${totalExpenses}</p>
            
          </div>
        </div>
      )}

      {totalExpenses >= 1000 && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Premium Activation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Your total expenses have reached 1000 . Activate premium to unlock
              additional features.
            </p>

            <Button variant="success">Activate Premium</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <div className="download-button">
              <CSVLink
                data={handleDownloadExpenses()}
                filename="expenses.csv"
                className="btn btn-primary"
              >
                Download Expenses as CSV
              </CSVLink>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Home;
