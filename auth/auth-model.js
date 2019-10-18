const db = require('../database/dbConfig')

module.exports = {
    getBy,
    add,
    remove
}
async function add(user) {
    const [id] = await db('users').insert(user)

    return db('users').where({id}).first()
}

function getBy(filter) {
    return db('users').where(filter).first()
}


function remove() {

}
