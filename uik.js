const pgConn = require('./modules/pg-connection');
const msConn = require('./modules/ms-connection');
const config = require('./config');

pgConn.init(config.string);

msConn.query('select top 1000 * from dbo.SS_Uiks', function(rows) {
    if(rows.length > 0) {
        var normal = [];
        for(var i in rows) {
            var row = rows[i];
            normal.push({
                id: row.LINK,
                c_area: row.C_Area,
                c_name: row.C_Name,
                c_address: row.C_Address,
                c_phone: row.C_Telephone,
                n_count: row.N_Count,
                //f_user: row.F_Users,
                c_boundary: row.C_Boundary
            })
        }

       function next() {
        var row = normal[0];
        normal.shift();
        if(row == null){
            return console.log('inserted');
        }

        var query = pgConn.insert('dbo', 'cs_uik', row);
        var values = [];
        for(var j in row){
            values.push(row[j]);
        }
        pgConn.query(query, values, function() {
            //console.log(arguments);
            next();
        });
    }
    next();
    }
})