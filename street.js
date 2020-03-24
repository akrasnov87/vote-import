const pgConn = require('./modules/pg-connection');
const msConn = require('./modules/ms-connection');
const config = require('./config');

pgConn.init(config.string);

msConn.query('select top 1000 * from dbo.SS_Streets', function(rows) {
    if(rows.length > 0) {
        var normal = [];
        for(var i in rows) {
            var row = rows[i];
            normal.push({
                id: row.LINK,
                c_name: row.C_Name,
                c_type: row.C_Type,
                c_street_name: row.C_Street_Name,
                c_yandex_name: row.C_Yandex_Name
            })
        }

       function next() {
        var row = normal[0];
        normal.shift();
        if(row == null){
            return console.log('inserted');
        }

        var query = pgConn.insert('dbo', 'cs_street', row);
        var values = [];
        for(var j in row){
            values.push(row[j]);
        }
        pgConn.query(query, values, function() {
            next();
        });
    }
    next();
    }
})