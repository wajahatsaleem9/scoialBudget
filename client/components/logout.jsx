import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';






function LogOut(){
    const navigate = useNavigate();

    const handleLogout = async () =>{
        await fetch('http://localhost:3001/api/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        },
        
    )
        .then(response => {
            if(response.ok){
               navigate('/login');
            }
            else{
                return response.json().then(errorData =>{
                    console.error('Logout failed: ', errorData.message)
                });

            }
        })

        .catch(e => console.log(e));
    }



    return(
        <>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>

        </>

    )

}


export default LogOut;