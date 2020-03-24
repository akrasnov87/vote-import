const { Connection, Request } = require("tedious");

const config = {
    authentication: {
      options: {
        userName: "voteX", // update me
        password: "voteX231" // update me
      },
      type: "default"
    },
    server: "db-srv-ag.omnis.local", // update me
    options: {
      database: "VoteX", //update me
      encrypt: true
    }
  };

const connection = new Connection(config);

exports.query = function(query, callback) {
  var results = [];
// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
      queryDatabase();
    }
  });
  
  function queryDatabase() {
    console.log("Reading rows from the Table...");
  
    // Read all rows from table
    const request = new Request( query,(err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          callback(results);
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
  
    request.on("row", columns => {
      var obj = {};
      for(var i in columns) {
        obj[columns[i].metadata.colName] = columns[i].value;
      }

      results.push(obj);
    });
  
    connection.execSql(request);
  }
}