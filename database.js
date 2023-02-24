const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db')

const init = () => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS user (username, password)")
    })
}

const register = (username, password) => {
    db.serialize(() => {
        db.run("INSERT INTO user VALUES (?,?)", [username, password], (err) => {
            if(err) return console.error(err.message)
        })
    })
}

const getUser = (username, password) => {
    return new Promise((res,rej) => {
        db.all("SELECT * FROM user WHERE username = ?", [username], (err, rows) => {
            if(err) rej(err)
            res(rows)
        })
    })
}

module.exports = {
    init,
    register,
    getUser
}