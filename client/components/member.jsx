import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Container, Row, Col, Form, Table, Card } from 'react-bootstrap';
import LogOut from './logout';

 function Member() {
    const [phase, setPhase] = useState(null);
    
   

    
        
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:3001/api/getPhase', {
              method: "GET",
              headers: { "Content-Type": "application/json" }
              //body: JSON.stringify({ current_phase: current_phase }) // Ensure current_phase is sent
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
    
        fetchData(); // Call fetchData function inside useEffect
    
      }, [phase]);
    

    return(
        <div style={{ 
          background: 'url(/background.jpg)', 
          backgroundSize: 'cover', 
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
           
            
           
        
            {phase == 0 && <PhaseZeroComponent/>}
            {phase == 1 && <PhaseOneComponent/>}
            {phase == 2 && <PhaseTwoComponent/>}
            {phase == 3 && <PhaseThreeComponent/>}
          
            
        </div>
    )
}



const PhaseZeroComponent = () => {
  const l_s_username = localStorage.getItem('username')
  const l_s_role = localStorage.getItem('role')

  return (
    <div>
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
              <h1 className="text-center">Phase 00</h1>
              <h5 className="text-center">Please wait for the admin to post the budget</h5>
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
};
const PhaseOneComponent = () =>{

  const [mem_budget, setMemBudget] = useState('')
  const [description, setDescription] = useState('')
  const [adminBudget, setAdminBudget] = useState('')
  const l_s_username = localStorage.getItem('username')
  const l_s_role = localStorage.getItem('role')


  const[proposal, setProposal] = useState([]);

  useEffect( () => {
    const fetchAdminBudget = async () =>{
      try {
        const response = await fetch('http://localhost:3001/api/getBudget', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            
        });
  
        const res = await response.json();
        setAdminBudget(res)
  
        console.log(adminBudget)
  
        
    } catch (error) {
        console.error('Error:', error);
    }
  
    }

    fetchAdminBudget();

  }, []);

  

  const handleSubmit = async (e) =>{

   

    
    e.preventDefault();
    
    const newProposal = {mem_budget ,description}
    const totalValue = proposal.reduce((total, item) => total + parseFloat(item.mem_budget), 0) + parseFloat(mem_budget);
    
    
    // Check if adding the new proposal exceeds the budget
    if (totalValue  > adminBudget.budget) {
      alert("The total value of the proposals exceeds the budget.");
      console.log("1aaa1", totalValue)
      return; 
    }
    setProposal([...proposal, newProposal]);
    setMemBudget('');
    setDescription('');

    
    
    try {
      const Credentials = localStorage.getItem("user_id");
      console.log(Credentials)
      const response = await fetch('http://localhost:3001/api/addProposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: Credentials, description: description, cost:mem_budget })
      });

      const res = await response.json();
      console.log(res)
      
  } catch (error) {
      console.error('Error:', error);
      // Handle error, e.g., show an error message
  }


  }

  const errorMessage = "Your limit exeed";

  const handleDelete = async (budget, description) =>{
    try {
      const response = await fetch('http://localhost:3001/api/deleteProposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({cost: budget, description:description})
      });

      const res = await response.json();
      console.log(res)
      
  } catch (error) {
      console.error('Error:', error);
     
  }

  setProposal(proposal.filter(item => item.mem_budget != mem_budget && item.description!= description))


    
  }
  

  


    return(<div>

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
      
        <h1>Phase 01</h1>
        <h3>Please add your proposal</h3>
        <h4>{proposal.length >= 3 && errorMessage}</h4>
        
        
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Proposal amount</Form.Label>
            <Form.Control
                                type="number"
                                value={mem_budget}
                                onChange={(e) => setMemBudget(e.target.value)}
                                placeholder="Enter your budget"
                                required
                            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Proposal Description</Form.Label>
            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter your description"
                                required
                            />
          </Form.Group>
          {proposal.length < 3 && <Button type='submit'>Submit</Button> }
        </Form>

        <h5 style={{ color: 'red' }}>
  <span style={{ fontWeight: 'bold', color: 'red' }}>The Total Budget is:</span> {adminBudget.budget}
</h5>


    
    
    
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Proposal Amount</th>
          <th>Description</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        
        {proposal.map((proposal, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
              <td>{proposal.mem_budget}</td>
              <td>{proposal.description}</td>
              <td><Button onClick={()=>{handleDelete(proposal.mem_budget, proposal.description)}}>Delete</Button></td>
              

          </tr>
        ))}
      </tbody>
      
    </Table>
    <div className="text-center mt-4">
                  <LogOut />
                  </div>
    </div>)
    
}
const PhaseTwoComponent = () => {
  const [allProposal, setAllProposal] = useState([]);
  const [error, setError] = useState(null);
  const user_id = localStorage.getItem("user_id")

  const l_s_username =  localStorage.getItem("username")
  const l_s_role = localStorage.getItem("role")

  useEffect(() => {
    const getAllProposal = async () => {
      try {
        
        
        const response = await fetch(`http://localhost:3001/api/getProposal/${user_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        const res = await response.json();
        // Initialize score field for each proposal
        const proposalsWithScore = res.map(proposal => ({ ...proposal, score: '' }));
        setAllProposal(proposalsWithScore);
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching proposals');
      }
    };

    getAllProposal();
  }, [user_id]);

  const handleScoreChange = (index, value) => {
    const newProposals = [...allProposal];
    newProposals[index].score = value;
    setAllProposal(newProposals);
  };

  const handleSave = async () => {
    try {
      const promises = allProposal.map(proposal => {
        const score = proposal.score != '' ? proposal.score: 0;
        console.log(parseInt(score));
        return fetch('http://localhost:3001/api/updateScore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: proposal.user_id,
            proposal_id: proposal.proposal_id,
            score: score
            
          })

        });
        
      });
      
      const response = await Promise.all(promises);
      alert('Scores updated successfully');
    } catch (err) {
      console.error('Error updating scores:', err);
      setError('Error updating scores');
    }
  };

  return (
    <div>
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
      <h1>Phase 02</h1>
      <h3>Your Proposals</h3>
      <h6>Range between 1-3</h6>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {allProposal.map((proposal, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{proposal.description}</td>
              <td>{proposal.cost}</td>
              <td>
                <input
                  type="number"
                  value={proposal.score}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  placeholder="Enter score"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={handleSave}>Save Scores</Button>
      <div className="text-center mt-4">
                  <LogOut />
                  </div>
    </div>
  );
};
const PhaseThreeComponent = () =>{
  const [adminBudget, setAdminBudget] = useState('');
  const [finalProposal, setFinalProposal] = useState([]);
  const [cumSumValue, setCumSumValue] = useState([]);
  const l_s_username =  localStorage.getItem("username")
  const l_s_role = localStorage.getItem("role")


  useEffect(()=>{
    let cumSum = 0
  const p = finalProposal.map((proposal) =>{
    
    cumSum += proposal.cost
    return(cumSum)
  });
  setCumSumValue(p)
  console.log('ggggggg', cumSumValue)

  }, [finalProposal])
  

  useEffect( () => {
    const fetchAdminBudget = async () =>{
      try {
        const response = await fetch('http://localhost:3001/api/getBudget', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            
        });
  
        const res = await response.json();
        setAdminBudget(res.budget)
  
        console.log(adminBudget)
  
        
    } catch (error) {
        console.error('Error:', error);
    }
  
    }

    fetchAdminBudget();

  }, []);



  useEffect( () => {
    const fetchFinalProposals = async () =>{
      //if (!adminBudget.budget) return; // Wait until adminBudget is fetched
      
      try {
        const response = await fetch('http://localhost:3001/api/finalProposals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({budget: adminBudget})
            
        });
  
        const res = await response.json();
        setFinalProposal(res.result)
        console.log("ssss",finalProposal)
        
    } catch (error) {
        console.error('Error:', error);
    }
  
    }

    fetchFinalProposals();

  }, []);
  

    return (
      <div>
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
      <h3>Final Proposals</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Proposal ID</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {finalProposal.map((proposal, index) => (
            <tr key={index}>
              <td>{proposal.proposal_id}</td>
              <td>{proposal.user_id}</td>
              <td>{cumSumValue[index] > adminBudget ? 'proposal not accepted':proposal.username}</td>
              <td>{proposal.description}</td>
              <td>{proposal.cost}</td>
              <td>{proposal.Total_score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-center mt-4">
                  <LogOut />
                  </div>
    </div>
    )
    
}


export {Member}