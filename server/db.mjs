import sqlite3 from 'sqlite3';

//opening database

const path = './'; //db.db

const db = new sqlite3.Database(path + 'db.db', (err) => {
    if(err) throw err

})

export default db