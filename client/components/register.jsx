import React, { useState } from 'react';
import { Button, Container, Row, Col, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function RegisterUser() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [role, setRole] = useState();
    const navigate = useNavigate();


    const handleChange = (e) =>{
        setRole(e.target.value)

    }
    const handleRegister = async () =>{
        try{
            const response = await fetch('http://localhost:3001/api/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username: username, password:password, role:role})
            });
            const res = await response.json();
            if(!res){
                alert("Invalid Credentils")
            }
            
            else if(res.user.role == 'admin'){
                console.log("else if is running");
                navigate('/admin')
            }
            else{
                console.log("ye nh chlna chyeg", res.user.role);
                navigate('/member');
            }


        }
        catch(error){
            console.error('Error:', error);

        }
    }

    return(
        <Container className="d-flex vh-100">
        <Row className="m-auto align-self-center w-100">
            <Col md={4} className="mx-auto">
                <h1 className="text-center mb-4">Register Page</h1>
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

                    <Form.Group>
                        <Form.Label>Your Role</Form.Label>
                        <Form.Control as="select" value={role} onChange={handleChange}>
                        <option value="">Choose...</option>
                        <option value="admin">Admin</option>
                        <option value="member">member</option>
                        </Form.Control>
                        
                        
                    </Form.Group>
                    <div className="text-center">
                       
                        <Button onClick={handleRegister}>Register</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    </Container>
    )
}

export {RegisterUser};