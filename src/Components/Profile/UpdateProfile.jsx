import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import {
  setProfileData,
  setIsCompleteProfile,
} from "../../Store/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCompleteProfile = useSelector(
    (state) => state.auth.isCompleteProfile
  );
  const profileData = useSelector((state) => state.auth.profileData);
  const isVerified = useSelector((state) => state.auth.isVerified);

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("loginId");
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDo-GMUlH9BQyAiH-8WzkaPymtrR5opfKw",
        {
          idToken: token,
          displayName: name,
          photoUrl: profilePhoto,
          returnSecureToken: true,
        }
      );
      if (response.status === 200) {
        dispatch(setIsCompleteProfile(true));
        console.log("profile updated");
        toast.success("Profile Updated");
        navigate("/");
      } else {
        toast.error("profile not updated");
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
    dispatch(setProfileData({ name, photo: profilePhoto }));
  };

  const handleSendVerificationEmail = async () => {
    const token = localStorage.getItem("loginId");
    try {
      
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDo-GMUlH9BQyAiH-8WzkaPymtrR5opfKw",
        {
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }
      );
      if (response.status === 200) {
        toast.success("verification mail sent");
      } else {
        toast.error("verification mail not sent");
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (isCompleteProfile) {
      const { name, photo } = profileData;
      setName(name);
      setProfilePhoto(photo);
    } else {
      setName("");
      setProfilePhoto("");
    }
  }, [isCompleteProfile, profileData]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <h2 className="mt-5">Update Profile</h2>
        <Button variant="success m-4" >Activate Premium</Button>
      </div>
      {!isVerified && (
        <Alert variant="warning">
          Your account is not verified. Click the button below to send a
          verification email.
          <Button variant="link" onClick={handleSendVerificationEmail}>
            Send verification email
          </Button>
        </Alert>
      )}
      {isVerified && <Alert variant="success">Your account is verified.</Alert>}

      {isCompleteProfile && (
        <Container className="my-3 py-3 border rounded">
          <Row className="align-items-center">
            <Col md={4}>
              <h4>Profile Name: {profileData.name}</h4>
            </Col>
            <Col md={8} className="text-center">
              <img
                src={profileData.photo}
                alt="Profile"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </Col>
          </Row>
        </Container>
      )}
      <Form onSubmit={handleUpdateProfile}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="profile-photo" className="mt-3">
          <Form.Label>Profile Photo URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URL"
            value={profilePhoto}
            onChange={(e) => setProfilePhoto(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Update Profile
        </Button>
      </Form>
    </div>
  );
};

export default UpdateProfile;
