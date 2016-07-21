// my dependencies
var mysql = require ('mysql');
var inquirer = require('inquirer');
var table = require('console.table');

//making the connection with mySQL
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'Bamazon'
});

//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        
    }
    makeTable();
})

//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
var makeTable = function() {
    //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//
        console.table(res);
        
        promptCustomer(res);
    });
};

//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {
        //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
        inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'What would you like to purchase?'
        }]).then(function(val) {

                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;
                //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
                for (var i = 0; i < res.length; i++) {                      
                  
                }

                //IF THE PRODUCT REQUESTED DOES NOT EXIST, RESTARTS PROMPT//
                if (i == res.length && correct == false) {
                    promptCustomer(res);
                }
            });
}

