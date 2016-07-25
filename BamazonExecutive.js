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

connection.connect(function (err){
  //sends error message to console if one exists
  if (err) throw err;
  //logs success upon success
  console.log('Connnection Established');
  executiveStuff();
});

var executiveStuff = function(){
  inquirer.prompt({
    type: 'list',
      name: 'options',
      message: 'Hello, what would you like to do?',
      choices: ['View Product Sales By Department', 'Create New Department','Quit Program']
    }).then(function(user){
      switch (user.options) {
        case 'View Product Sales By Department':
          viewSales();
        break;

        case 'Create New Department':
          makeNewDepartment();
        break;

        case 'Quit Program':
          connection.end();
        break;

        default:
          console.log('You broke it.')

      }
    });
};

var viewSales = function(){
  connection.query('SELECT *, (TotalSales-OverHeadCost) TotalProfit FROM Departments ORDER BY Departments.DepartmentID', function(err, res){
    if (err) throw err;
    console.log('-------------------Here is the sales mix for the company.-------------------');
    console.log('----------------------------------------------------------------------------');
    console.log('| DepartmentID | DepartmentName | OverHeadCost | TotalSales | TotalProfit |');
    console.log('----------------------------------------------------------------------------');
    // console.log(res);
    for (var i = 0; i < res.length; i++){
      console.log('| '+' '+' '+' '+' '+' '+' '+res[i].DepartmentID+' '+' '+' '+' '+' '+' | '+
            ' '+' '+res[i].DepartmentName+' '+' '+' | '+' '+' '+' '+' '+res[i].OverHeadCosts+
            ' '+' '+' '+' | '+' '+' '+res[i].TotalSales+' '+' '+' | '+' '+' '+' '+
            res[i].TotalProfit+' '+' '+' |');
      console.log('----------------------------------------------------------------------------');
    };
    //Keeps program running
    executiveStuff();
  });
};

var makeNewDepartment = function(){
  connection.query('SELECT * FROM Products, Departments', function(err, res){
  inquirer.prompt([
      {
        type: 'input',
        name: 'ItemID',
        message: 'Please input a unique ItemID.',
        validate: function(value) {
        if (isNaN(value) == true || value == null || value == undefined ||value == '') {
          console.log('Please enter a valid number');
          return false;
        };
        return true;
        }
      },
      {
        type: 'input',
        name: 'ProductName',
        message: 'Please input the Product Name.',
        validate: function(value) {
        if (value == undefined || value == null || value == '') {
          console.log('Please enter a valid Product Name');
          return false;
        };
        return true;
        }
      },
      {
        type: 'input',
        name: 'DepartmentName',
        message: 'Please input the Department name.',
        validate: function(value) {
        if (value == undefined || value == null || value == '') {
          console.log('Please enter a valid Department Name');
          return false;
        };
        return true;
        }
      },
      {
        type: 'input',
        name: 'Price',
        message: 'Please input the items Price.',
        validate: function(value) {
        if (isNaN(value) == true || value == null || value == undefined ||value == '') {
          console.log('Please enter a valid number');
          return false;
        };
        return true;
        }
      },
      {
        type: 'input',
        name: 'StockQuantity',
        message: 'Please input the amount of this item you want to put into Stock.',
        validate: function(value) {
        if (isNaN(value) == true || value == null || value == undefined ||value == '') {
          console.log('Please enter a valid number');
          return false;
        };
        return true;
        }
      },
      {
        type: 'input',
        name: 'OverHeadCosts',
        message: 'Please input the over head costs of this department.',
        validate: function(value) {
        if (isNaN(value) == true || value == null || value == undefined ||value == '') {
          console.log('Please enter a valid number');
          return false;
        };
        return true;
        }
      },
      {
        type: 'input',
        name: 'TotalSales',
        message: 'Please input the current total sales amount for this department.',
        validate: function(value) {
        if (isNaN(value) == true || value == null || value == undefined ||value == '') {
          console.log('Please enter a valid number');
          return false;
        };
        return true;
        }
      },
    ]).then(function(user){
      var newProduct = {ItemID: user.ItemID, ProductName: user.ProductName, DepartmentName: user.DepartmentName, Price: user.Price, StockQuantity: user.StockQuantity};
      var newDepartment = {DepartmentName: user.DepartmentName, OverHeadCosts: user.OverHeadCosts, TotalSales: user.TotalSales};
      connection.query('INSERT INTO Products SET ?', newProduct, function(err, res){
        if (err) throw err;
        //shows updated inventory report
        checkInventory();
      });
      connection.query('INSERT INTO Departments SET ?', newDepartment, function(err, res){
        if (err) throw err;
        //shows updated Department view
        viewSales();
      });
      //Keeps program running
      executiveStuff();
    });
  });
};

var checkInventory = function(){
  connection.query('SELECT * FROM Products ORDER BY Products.ItemID', function(err, res){
    if (err) throw err;
    //making it look pretty
    console.log("\n Bamazon.com Inventory Workup");
    console.log("---------------------------------------------------------------------------------------------------");
    for (var i = 0; i < res.length; i++){
      console.log('Product ID: '+res[i].ItemID+" | "+res[i].ProductName+" | $"+res[i].Price+" | Instock Quantity: "+res[i].StockQuantity+" | Department: "+res[i].DepartmentName);
    }
    console.log("---------------------------------------------------------------------------------------------------");
    });
};