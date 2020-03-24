const pgConn = require('./modules/pg-connection');
const msConn = require('./modules/ms-connection');
const config = require('./config');

pgConn.init(config.string);

msConn.query('select top 10000 * from dbo.SS_Houses', function(rows) {
    if(rows.length > 0) {
        var normal = [];
        for(var i in rows) {
            var row = rows[i];
            normal.push({
                id: row.LINK,
                f_street: row.F_Street,
                c_number: row.C_Number,
                c_house_num: row.C_House_Num,
                c_build_num: row.C_Build_Num,
                c_struc_num: row.C_Struc_Num,
                n_number: row.N_Number,
                f_user: row.F_User,
                n_latitude: row.N_Latitude,
                n_longitude: row.N_Longitude,
                c_data: row.C_Data,
                b_student_hostel: row.B_Student_Hostel
            })
        }

       function next() {
        var row = normal[0];
        normal.shift();
        if(row == null){
            return console.log('inserted');
        }

        var query = pgConn.insert('dbo', 'cs_house', row);
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