// create var to hold db connection
let db;

// establish a connection to IndexDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('budge-tracker', 1);

// this event will emit if the db v. changes 
request.onupgradeneeded = function (e) {
    // save a ref to the db
    const db = e.target.result;
    // create a object store (table) called 'new_data', set it to have an auto incrementing primary ket of sorts
    db.createObjectStore('new_data', { autoIncrement: true });
}

// upon a successful
request.onsuccess = function(e) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db. = e.target.result;

    // check if app is online, if yes run 
}