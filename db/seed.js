const { client, getAllUsers, createUser } = require('./index')



async function dropTables(){
    try {
        console.log('starting to drop tables')
        await client.query(`
        DROP TABLE IF EXISTS users;
        `)
        console.log('finished dropping tables')
    } catch (error) {
        console.log(error)
    }
}

async function createTables(){
    try {
        console.log('starting to create tables')
        await client.query(`
        CREATE TABLE users(
           id SERIAL PRIMARY KEY,
           username VARCHAR(255) UNIQUE NOT NULL,
           password VARCHAR(255) NOT NULL
        );
        `)
        console.log('finished createing table')
    } catch (error) {
        console.log(error)
    }
}

async function createFirstUsers(){
    try {
        console.log('creating users')
        const albert = await createUser({ username: 'albert', password: 'bertie99' });
        const sandra = await createUser({username: 'sandra', password: '2sandy4me'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam'});
        console.log('finished creating user')
    } catch (error) {
        console.log(error)
    }
}



async function testDB() {
    try {
        const users = await getAllUsers();
        console.log('These are users', users)
    } catch (error) {
        console.log(error)
    }
}


async function rebuildDB(){
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createFirstUsers();
    } catch (error) {
        console.log(error)
    }
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end())