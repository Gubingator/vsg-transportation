# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import mysql.connector
from mysql.connector import errorcode
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
import json

# Obtain connection string information from the portal

config = {
    'host': 'carpool-test.mysql.database.azure.com',
    'user': 'carpooltest',
    'password': 'Testing123',
    'database': 'carpools'
}

student_delimiter = ", "


def parse_carpool_set_sql(carpool):
    to_return = []
    for carpool_1 in carpool:
        element = parse_carpool_sql(carpool_1)
        to_return.append(element)
    return to_return


def parse_carpool_sql(carpool):
    # format: (1, This is a list of students, The departure, The destination, 2022-03-21 04:00:00)
    list_students = []
    for student in str(carpool[1]).split(student_delimiter):
        list_students.append(student)
    print(list_students)
    the_date_time = str(carpool[4]).split(" ")
    the_date = the_date_time[0].split("-")
    element = {'id': carpool[0], 'students': list_students, 'departure': str(carpool[2]),
               'destination': str(carpool[3]), 'year': the_date[0], 'month': the_date[1],
               'day': the_date[2], 'time': the_date_time[1]}
    return element

def add_student(carpool, new_student):
    # format: (1, This is a list of students, The departure, The destination, 2022-03-21 04:00:00)
    new_carpool = list([])

    for i in range(len(carpool)):
        if i == 1:
            new_carpool.append(carpool[i] + student_delimiter + new_student)
            continue
        new_carpool.append(carpool[i])
    return tuple(new_carpool)

# Construct connection string

try:
    conn = mysql.connector.connect(**config)
    print("Connection established")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with the user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
else:
    cursor = conn.cursor()

# Drop previous table of same name if one exists
cursor.execute("DROP TABLE IF EXISTS carpools;")
print("Finished dropping table (if existed).")

# Create table
cursor.execute(
    "CREATE TABLE carpools (id INTEGER PRIMARY KEY AUTO_INCREMENT, student_list VARCHAR(255), departure VARCHAR(255), destination VARCHAR(255) ,date_time DATETIME);")
print("Finished creating table.")

# Insert some data into table
cursor.execute(
    "INSERT INTO carpools (student_list, departure, destination, date_time) VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %h:%i'));",
    ("Student 1, Student 2", "Hank Circle", "Chik-fil-a",  "2022-3-21 4:00"))
print("Inserted", cursor.rowcount, "row(s) of data.")
cursor.execute(
    "INSERT INTO carpools (student_list, departure, destination, date_time) VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %h:%i'));",
    ("Student 3, Student 4", "Morgan Circle", "Broadway",  "2022-3-21 6:00"))

cursor.execute(
    "INSERT INTO carpools (student_list, departure, destination, date_time) VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
    ("Student 5", "EBI Circle", "BNA Airport", "2022-3-22 18:00"))



# Read data
cursor.execute("SELECT * FROM carpools;")
rows = cursor.fetchall()
print("Read", cursor.rowcount, "row(s) of data.")

# Print all rows
for row in rows:
    print("Data row = (%s, %s, %s, %s)" % (str(row[0]), str(row[1]), str(row[2]), str(row[3])))

print(parse_carpool_set_sql(rows))

# Cleanup
conn.commit()

app = Flask(__name__)
api = Api(app)
CORS(app, resource={r"/*": {"origins": "*"}})


class AccessCarpool(Resource):
    def get(self):
        cursor.execute("SELECT * FROM carpools;")
        rows = cursor.fetchall()
        return {'carpools': parse_carpool_set_sql(rows)}


class CarpoolPut(Resource):
    def post(self, carpool_id):
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        the_time = inst['time'].split(":")
        the_students = inst['students']
        student_string = ""
        for stu in the_students:
            student_string = student_string + stu + student_delimiter
        student_string = student_string[:len(student_string)-2]
        the_date = inst['year'] + "-" + inst['month'] + "-" + inst['day'] + " " + the_time[0] + ":" + the_time[1]
        cursor.execute(
            "INSERT INTO carpools (student_list, departure, destination, date_time) VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
            (student_string, inst['departure'], inst['destination'],  the_date))
        print("Inserted", cursor.rowcount, "row(s) of data.")
        cursor.execute("SELECT LAST_INSERT_ID();")
        rows = cursor.fetchall()
        conn.commit()
        return {'id': rows[0][0]}


class JoinCarpool(Resource):
    def get(self, carpool_id):
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))
        
        print(carpool_id)
        cursor.execute("SELECT * FROM carpools WHERE id = %s;", list(carpool_id))
        rows = cursor.fetchall()
        new_carpool = add_student(rows[0], 'Ethan Piper')
        print(new_carpool)
        cursor.execute("UPDATE carpools "
                       "SET student_list = %s "
                       "WHERE id = %s",
                       (str(new_carpool[1]), carpool_id))
        conn.commit()
        return {'carpool': parse_carpool_sql(new_carpool)}
        #return {'carpool': parse_carpool_sql(rows)}



# curl http://localhost:5000/carpools/1 -d "data={'id': 1, 'help':2}" -X POST
# curl http://localhost:5000/carpools/1 -d "data={\"id\": 1, \"help\":2}" -X POST
api.add_resource(AccessCarpool, '/')
api.add_resource(CarpoolPut, '/carpool/<string:carpool_id>')
api.add_resource(JoinCarpool, '/carpool/join/<string:carpool_id>')

if __name__ == '__main__':
    app.run(debug=True)
    cursor.close()
    conn.close()
    print("Done.")
