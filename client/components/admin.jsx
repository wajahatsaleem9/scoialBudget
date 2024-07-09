import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import LogOut from './logout';

function Admin() {
  const [budget, setBudget] = useState(0);
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getPhase', {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPhase(data.current_phase);
        console.log(data.current_phase);
        
      } catch (error) {
        console.error('Error fetching phase:', error);
      }
    };

    fetchData();
  }, []);

  const handleBudgetButton = async () => {
    setPhase(prev => prev <= 2 ? prev + 1 : 0);
    console.log('bahir hn')

    if (phase == 3){
      console.log('ander hn')

      const resetDb = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/resetDb', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            //body: JSON.stringify({ current_phase: phase })
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          console.log(phase);
          
        } catch (error) {
          console.error('Error fetching phase:', error);
        }
      };
      resetDb();

      
    }
  };

  useEffect(() => {
    const changePhase = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/changePhase', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_phase: phase })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(phase);
        
      } catch (error) {
        console.error('Error fetching phase:', error);
      }
    };

    if (phase !== null) changePhase();
  }, [phase]);

  useEffect(() => {
    const changeBudget = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/setBudget', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ budget: budget })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(phase);
        
      } catch (error) {
        console.error('Error fetching phase:', error);
      }
    };

    changeBudget();
  }, [budget]);
  const l_s_username =  localStorage.getItem("username")
  const l_s_role = localStorage.getItem("role")


  

  return (
    <div style={{ 
      background: 'url(/background.jpg)', 
      backgroundSize: 'cover', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
       <Container>
    <Row>
      <Col className="text-center mt-0" style={{ color: '#000000' }}>
        <h2 className="mb-1">Bongiourno !!</h2>
      </Col>
    </Row>
    <Row>
      <Col className="text-center mt-0" style={{ color: '#456382' }}>
        <div>
          <h4 style={{ display: 'inline-block', marginRight: '10px' }}>{l_s_username}:</h4>
          <h5 style={{ display: 'inline-block' }}>{l_s_role}</h5>
        </div>
      </Col>
    </Row>
  </Container>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <Card style={{ opacity: 0.9 }}>
              <Card.Body>
                {phase == 0 && (
                  <Form>
                  <h1 className="text-center">Phase 00</h1>
                  <h2 className="text-center">Define Budget</h2>
                  <Form.Group controlId="formBudget" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                      Set Your Budget:
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Enter your Budget"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleBudgetButton} className="w-100">Next Phase</Button>
                </Form>
                
                )}

                {phase == 1 && (
                  <div className="text-center">
                    <h1>Phase 01</h1>
                    <h5 className="text-center">Proposal accepting phase</h5>
                    <Button variant="primary" onClick={handleBudgetButton}>Next Phase</Button>
                  </div>
                )}

                {phase == 2 && (
                  <div className="text-center">
                    <h1>Phase 02</h1>
                    <h5 className="text-center">Voting Phase</h5>
                    <Button variant="primary" onClick={handleBudgetButton}>Next Phase</Button>
                  </div>
                )}

                {phase == 3 && (
                  <div className="text-center">
                    <h1>Phase 03</h1>
                    <h5 className="text-center">Result Phase</h5>
                    <Button variant="danger" onClick={handleBudgetButton}>Restart</Button>
                  </div>
                )}

                  <div className="text-center mt-4">
                  <LogOut />
                  </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export { Admin };

