//makes use of inquire npm
var inquirer = require("inquirer");
//makes use of mysql npm
var mysql = require("mysql");
//makes connection to database
var connection = mysql.createConnection({
  host : 'LocalHost',
  port: 3306,
  user : 'root',   //username
  password : '', //password
  database : 'Bamazon'
});

//used to build scrollable list in inquirer prompt
var productList = [];

connection.connect(function (err){
  //sends error message to console if one exists
  if (err) throw err;
  //logs success upon success
  console.log('Connnection Established...');
});

connection.query('SELECT * FROM products ORDER BY products.ItemID', function(err, res){
  //logs out error if present
  if (err) throw err;
  //making it look pretty
  console.log("Welcome to Bamazon.com.  What would you like to buy today?")
  console.log("--------------------------------------------------------------");
  for (var i = 0; i < res.length; i++){
    console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price);
    //Builds selectable list for purchase prompt
    productList.push(res[i].ProductName);
  }
  console.log("--------------------------------------------------------------");
  // console.log(productList);
  //AFTER item list console.logs, user is prompted whether they want to buy something or end program
  customerChoice();
});

var customerChoice = function(){
  inquirer.prompt({
      type: 'list',
      name: 'options',
      message: 'Hello, what would you like to do?',
      choices: ['View Products for Sale','Quit Program']
    }).then(function(user){
      switch (user.options){
        case 'View Products for Sale':
          purchase();
        break;

        case 'Quit Program':
          connection.end();
        break;

        default:
          console.log("You broke it!");
      };
    });
};

var purchase = function(){
  inquirer.prompt([
  {
    type: 'list',
    name: 'product',
    message: "Which product would you like to purchase today?",
    //list built on initial connection 
    choices: productList
  },
  {
    type: 'input',
    name: 'amount',
    message: 'And how many would you like to purchase?',
    //makes sure an actual number was entered
    validate: function(value) {
      if (isNaN(value) == true || value == null) {
        console.log('Please enter a valid number');
        return false;
      }
      return true;
    }
  }

  ]).then(function(user){
    //builds data object containing all info from both databases and joins the 2 instances that are the same, the DepartmentName 
    connection.query('SELECT * FROM Products INNER JOIN Departments ON (Products.DepartmentName=departments.DepartmentName)'+
            ' WHERE (Products.ProductName = ?)', user.product, function(err,res){
      if (err) throw err;
      //checks to see if enough products are in stock
      //console.log(res);
      if (user.amount > (res[0].StockQuantity - user.amount)) {
        console.log('Insufficient quantity.  Please select less to buy.\n')
        //re-runs the program so that the user can try again
        purchase();
      } else {
        //shows user what they purchased, how many, and at what price
        console.log('You have ordered '+user.amount+' '+user.product+'(s) at $'+res[0].Price+'\n');
        //gives user the total amount of purchase
        console.log('Your total cost is $'+(res[0].Price*user.amount)+'\n');
        //updates databases
        connection.query('UPDATE Products SET StockQuantity = "'+(res[0].StockQuantity - user.amount)+'" WHERE ProductName = "'+user.product+'"');
        connection.query('UPDATE Departments SET TotalSales = "'+(res[0].TotalSales + (res[0].Price*user.amount))+'" WHERE DepartmentName = "'+res[0].DepartmentName+'"')
      }
      customerChoice();
    });
  });
 }
//ends connection to allow new program to be run if user wants
var disconnect = function(){
  inquirer.prompt({
    type: 'list',
    name: 'quit',
    message: 'Would you like to quit?',
    choices:['Yes','No']
  }).then(function(user){
    if (user.quit == 'Yes') {
      connection.end();     
    } else {
      purchase();
    };
  });
};