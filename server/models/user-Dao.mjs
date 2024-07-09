import { resolve } from 'path';
import db from '../db.mjs'
import crypto from 'crypto';
import { rejects } from 'assert';


export default function UserDao() {

    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) =>{
            const query = 'SELECT * FROM users Where username = ?';
            db.get(query, [username], (err, row) =>{
                if(err){
                    reject(err)
                } else if(row == undefined){
                    resolve(false)
                }
                else{
                    const user = {success: true, user_id: row.user_id, username: row.username, role: row.role }
                    crypto.scrypt(password, row.salt, 64, function(err, hashedPassword) {
                        if(err) reject(err);
                        if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                            resolve(false)
                        else resolve(user);

                    });
                }
            })
        }

        )
    };

    this.registerUser = (username, password, role) =>{
        return new Promise((resolve, reject) =>{
            const salt = crypto.randomBytes(16).toString('hex');
            crypto.scrypt(password, salt, 64, (err, hashedPassword) =>{
                if(err){
                    reject(err);
                } else{
                    const hash = hashedPassword.toString('hex');
                    
                
                

                //insert new user in database
            
                const query = 'INSERT INTO users(username, role, salt, hash) VALUES(?, ?, ?, ?)';
                db.run(query, [username, role, salt, hash], (err) =>{
                    if(err){
                        reject(err);
                    }
                    else{
                        const newUser = {
                            user_id: this.LastID,
                            username: username,
                            role: role,
                            salt: this.salt,
                            hash: this.hash,
                        }
                        resolve(newUser);
                    }

                });
            }
                
            })
        })
    };

    this.getRole = (user_id) =>{
        return new Promise((resolve, reject) =>{
            const query = "SELECT role FROM users WHERE user_id = ?";
            db.get(query, [user_id], (err, row) =>{
                if(err){
                    reject(err)
                }
                else if(row=== undefined){
                    resolve({error:"User not found"})
                }
                else{
                    resolve(row)
                }
            })
        })
    };

    this.getPhase = () =>{
        return new Promise((resolve, reject) =>{
            const query = 'SELECT current_phase FROM phases';
            db.get(query, [], (err, row) =>{
                if(err) reject(err)
                else if (row === undefined) resolve({error: "Phase not found"})
                else resolve(row)
            })
        })
    };

    this.getBudget = () =>{
        return new Promise((resolve, reject) =>{
            const query = 'SELECT budget FROM budget WHERE id = 1';
            db.get(query, [], (err, row) =>{
                if(err) reject(err)
                else if (row === undefined) resolve({error: "Phase not found"})
                else resolve(row)
            })
        })
    };

    this.changePhase = (current_phase) =>{
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE phases SET current_phase = ? WHERE id = 1';
            db.get(query, [current_phase], (err, row) =>{
                if(err) reject(err)
                else if (row === undefined) resolve({error: "Phase not found"})
                else resolve(row)
            })
        })
    };

    this.setBudget = (budget) =>{
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE budget SET budget = ? WHERE id = 1';
            db.get(query, [budget], (err, row) =>{
                if(err) reject(err)
                else if (row === undefined) resolve({error: "Phase not found"})
                else resolve(row)
            })
        })
    };

    this.addProposal = (user_id, description, cost) =>{
        return new Promise((resolve, reject) =>{
            const query = 'INSERT INTO proposals(user_id, description, cost) VALUES(?, ?, ?)';
            db.run(query, [user_id, description, cost], (err) =>{
                if(err) reject(err)
                else {
                        const newProposal = {
                            id: this.LastID,
                            user_id: user_id,
                            description: description,
                            cost: cost
                        }
            
            
            
                    resolve(newProposal)}
            })
        })
    };

    this.deleteProposal = (cost, description) =>{
        return new Promise((resolve, reject) =>{
            const query = 'DELETE FROM proposals WHERE cost = ? AND description = ?';
            db.run(query, [cost, description], (err) =>{
                if(err) reject(err)
                else resolve()
            })
        })
    };


    this.getProposal = (user_id) =>{
        return new Promise((resolve, reject) =>{
            const query = 'SELECT proposal_id, user_id, description, cost FROM proposals WHERE user_id <> ?';
            db.all(query, [user_id], (err, row) =>{
                if(err) reject(err)
                else if (row === undefined) resolve({error: "Phase not found"})
                else resolve(row)
            })
        })
    };

    this.getUser = (user_id) =>{
        return new Promise((resolve, reject) =>{
            const query = 'SELECT username FROM users WHERE user_id = ?';
            db.get(query, [user_id], (err, row) =>{
                if(err) reject(err)
                else if (row === undefined) resolve({error: "Phase not found"})
                else resolve(row)
            })
        })
    };


    this.updateScore = (user_id, proposal_id, score) =>{
        return new Promise((resolve, reject) =>{
            const query = 'INSERT INTO votes(user_id, proposal_id, score) VALUES(?, ?, ?) ON CONFLICT(user_id, proposal_id) DO UPDATE SET score=excluded.score';

            db.run(query, [user_id, proposal_id, score], (err, row) =>{
                if(err) reject(err)
                else resolve(row)
            })
        })
    };


    this.finalProposals = () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    p.proposal_id,
                    u.user_id,
                    u.username,                    
                    p.description,
                    p.cost,
                    SUM(v.score) as Total_score
                FROM
                    users u
                    JOIN proposals p ON p.user_id = u.user_id
                    JOIN votes v ON v.proposal_id = p.proposal_id
                GROUP BY
                    p.proposal_id,
                    u.user_id,
                    u.username,
                    p.description,
                    p.cost
                ORDER BY
                    Total_score DESC;
            `;
            
            db.all(query,[], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve({ error: "Proposal not found" });
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.resetDb = () =>{
        return new Promise((resolve, reject) => {
            const query01 = 'DELETE FROM votes';

            db.run(query01, [], (err, row) =>{
                if(err) reject(err)
                else resolve(row)
            })

            const query02 = 'DELETE FROM proposals';

            db.run(query02, [], (err, row) =>{
                if(err) reject(err)
                else resolve(row)
            })
        })
    };

    
    

    
};
