const pgConn = require('./modules/pg-connection');
const msConn = require('./modules/ms-connection');
const config = require('./config');

pgConn.init(config.string);

msConn.query('select top 1000000 * from dbo.SS_Apartments', function(rows) {
    if(rows.length > 0) {
        var normal = [];
        for(var i in rows) {
            var row = rows[i];
            normal.push({
                id: row.LINK,
                f_house: row.F_Houses,
                c_prefix: row.C_Prefix,
                c_number: row.C_Number,
                n_number: row.N_Number,
                b_custom: row.B_Custom
            });
        }

       function next() {
        var values = [];
        var first;
        var count = 0;
        for(var i =0; i < 50; i++) {
            if(i == 0) {
                first = normal[i];
            }
            for(var j in normal[i]){
                values.push(normal[i][j]);
            }
            normal.shift();
            count++;
        }
        var row = normal[0];
        normal.shift();
        if(row == null){
            return console.log('inserted');
        }

        var query = pgConn.insertMany('dbo', 'cs_apartment', first, count);
        
        pgConn.query(query, values, function() {
            console.log('lost: ' + normal.length)
            next();
        });
    }
    next();
    }
})