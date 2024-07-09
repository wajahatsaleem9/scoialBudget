import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Container, Row, Col, Form } from 'react-bootstrap';

function LoginPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });
    
            const res = await response.json();
            console.log(res);
    
            if (!res.success) {
                alert("Invalid Credentials");
            } else if (res.role === 'admin') {
                localStorage.setItem('user_id', res.user_id);
                localStorage.setItem('role', res.role);
                localStorage.setItem('username', res.username);
               
                navigate('/admin');
            } else {
                localStorage.setItem('user_id', res.user_id);
                localStorage.setItem('role', res.role);
                localStorage.setItem('username', res.username);
                navigate('/member');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error, e.g., show an error message
        }
    };

    const handleRegister = () => {
        navigate('/register');
    }
    

    

    return (
        <Container className="d-flex vh-100">
            <Row className="m-auto align-self-center w-100">
                <Col md={4} className="mx-auto">
                    <h1 className="text-center mb-4">Login Page</h1>
                    <Form>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                required
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="outline-dark" onClick={handleLogin}>Login</Button>
                            <Button onClick={handleRegister}>Register</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export { LoginPage };