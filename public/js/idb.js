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
    db = e.target.result;

    // check if app is online, if yes run uploadData() func to send all local db data to api
    if (navigator.online) {
        uploadData();
    }
};

request.onerror = function(e) {
    // log error here
    console.log(e.target.errorCode);
}

// this function will be executed if we attempt to submit a new record and theres no internet connection 
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_data'], 'readwrite');

    //access the object store for `new_object`
    const budgetObjectStore = transaction.objectStore('new_data');

    // add record to your store with add method
    budgetObjectStore.add(record);
}

function uploadData() {
    // open a transaction on you db
    const transaction = db.transaction(['new_data'], 'readwrite');

    // access your object store
    const budgetObjectStore = transaction.objectStore('new_data');

    // get all records from store and set to a var
    const getAll = budgetObjectStore.getAll();

    // upon a succesfull .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data un indexedDb's store, lets send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers:{
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }                
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_data'], 'readwrite');
                // access the new_record object store
                const budgetObjectStore = transaction.objectStore('new_data');
                // clear all items in your store
                budgetObjectStore.clear();

                alert('All saved records have been submitted');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};

window.addEventListener('online', uploadData);