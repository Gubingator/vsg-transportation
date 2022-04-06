from email.utils import getaddresses
import mysql.connector
from mysql.connector import errorcode
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
import json
import config, conf_email

student_delimiter = ", "


# Parse the output from the database and turn into a JSON that can
# be used by the web-application
#
# @param carpool the set of carpools from the database
# @return The list of carpools in the correct format
def parse_carpool_set_sql(carpool):
    to_return = []
    for carpool_1 in carpool:  # Parse each carpool separately and add them to a list
        element = parse_carpool_sql(carpool_1)
        to_return.append(element)
    return to_return


# Take one singular carpool and format it into the correct format
# that can be used in the web-app. An example of the format is below:
#
# {
#   id: 1,
#   students: ["Student1" , "Student2"],
#   departure: "Hank Circle",
#   destination: "Chick-fil-a",
#   year: "2022",
#   month: "04",
#   day: "03",
#   time: "4:00:00",
# }
#
# @param carpool One carpool object from the database
# @return One carpool in JSON format
def parse_carpool_sql(carpool):
    # format: (1, This is a list of students, The departure, The destination, 2022-03-21 04:00:00)
    list_students = []
    for student in str(carpool[1]).split(student_delimiter):  # Create the list of students from the student string
        list_students.append(student)
    print(list_students)
    the_date_time = str(carpool[4]).split(" ")  # Split the date string
    the_date = the_date_time[0].split("-")
    # Create the JSON element to send to the web-app
    element = {'id': carpool[0], 'students': list_students, 'departure': str(carpool[2]),
               'destination': str(carpool[3]), 'year': the_date[0], 'month': the_date[1],
               'day': the_date[2], 'time': the_date_time[1]}
    return element


# Construct connection string

try:
    conn = mysql.connector.connect(**config.db_config)
    print("Connection established")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with the user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
else:
    cursor = conn.cursor(buffered=True)


# Start the app
app = Flask(__name__)
api = Api(app)
CORS(app, resource={r"/*": {"origins": "*"}})


# Get all the carpools from the database and send them to the web-app
#
# @return The list of carpools in JSON format
class GetAllDatabaseCarpools(Resource):
    def get(self):
        cursor.execute("SELECT * FROM carpools;")
        rows = cursor.fetchall()
        return {'carpools': parse_carpool_set_sql(rows)}


# Get the new carpool from the web-app and add to the database
#
# @return The new to give the carpool object that the database assigned to it.
class AddCarpoolToDatabase(Resource):
    def post(self):
        # Get the Data from the post requst
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        # Format the time, students, and date so that we can add it in the database
        the_time = inst['time'].split(":")
        the_students = inst['students']
        student_string = ""
        for stu in the_students:
            student_string = student_string + stu + student_delimiter
        student_string = student_string[:len(student_string) - 2]
        the_date = inst['year'] + "-" + inst['month'] + "-" + inst['day'] + " " + the_time[0] + ":" + the_time[1]

        # Insert the data into the database
        cursor.execute(
            "INSERT INTO carpools "
            "(student_list, departure, destination, date_time) "
            "VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
            (student_string, inst['departure'], inst['destination'], the_date))

        # Get the last inserted id in the database.
        # Since the id has the autoincrement property in the table, we need to make sure
        # the ids on the database and web-app side are consistent
        cursor.execute("SELECT LAST_INSERT_ID();")
        rows = cursor.fetchall()

        # Commit the data
        conn.commit()

        # Return the new id
        return {'id': rows[0][0]}


# Add a student to a specific carpool
#
# @param carpool_id The id of the carpool to add the student to
# @return The new carpool to update on the front-end
class JoinCarpool(Resource):
    def post(self, carpool_id):
        # Get the data included in the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        # Grab the specific carpool from the database
        cursor.execute("SELECT * FROM carpools WHERE id = %s;", list(carpool_id))
        rows = cursor.fetchall()

        # Create the new carpool to be sent back to the web-app
        new_carpool = add_student_to_list(rows[0], inst['newStudent'])

        # Update the carpool in the database
        cursor.execute("UPDATE carpools "
                       "SET student_list = %s "
                       "WHERE id = %s",
                       (str(new_carpool[1]), carpool_id))
        conn.commit()
        return {'carpool': parse_carpool_sql(new_carpool)}


# Send an email to the user with a confirmation code
class SendVerificationEmail(Resource):
    def post(self):
        # Get the data included in the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        # Send the email to the user with the verification code
        user_email = inst['email']
        verification_code = conf_email.get_verification_code()
        conf_email.set_verify_email_content(verification_code, user_email)

        # Grab the carpool id from the database
        cursor.execute("SELECT id "
                       "FROM carpools "
                       "WHERE email = %s", user_email)
        rows = cursor.fetchall()

        # Insert the verification code into the database
        cursor.execute("INSERT INTO passengers "
                       "(carpool_id, email, code, created_at) "
                       "VALUES (%s, %s, %s, NOW());",
                       rows[0], user_email, verification_code)
        
        conn.commit()


# Add a student to a list of students in a carpool
#
# @param carpool The carpool to add the student to
# @param new_student The name of the new_student to add to the list
# @return The new carpool to be updated in the database
def add_student_to_list(carpool, new_student):
    # format: (1, This is a list of students, The departure, The destination, 2022-03-21 04:00:00)
    new_carpool = list([])

    # In order to add the student to the carpool object, we need to copy the whole carpool
    for i in range(len(carpool)):
        if i == 1:  # if we are at the student list, then add the new student
            new_carpool.append(carpool[i] + student_delimiter + new_student)
            continue
        new_carpool.append(carpool[i])  # Append the other elements
    return tuple(new_carpool)


# Sends an email with the GroupMe carpool link
#
# @param passenger_id   The id of the user stored in the database
# @param email_address  The email address of the user
def send_carpool_email(passenger_id, email_address):

    # Get the carpool id
    cursor.execute("SELECT carpool_id "
                   "FROM passengers "
                   "WHERE passenger_id = %s;",
                   passenger_id)
    carpool_id = cursor.fetchone()

    # If the carpool already has a GroupMe chat, then get the link
    cursor.execute("SELECT groupme_link "
                   "FROM carpools "
                   "WHERE id = %s",
                   carpool_id)
    gm_link = cursor.fetchone()

    # If the carpool does not have a GroupMe chat,
    #   then create a new chat and add the link to the database
    if gm_link == None:
        gm_link = conf_email.create_groupme_link()
        cursor.execute("UPDATE carpools "
                       "SET groupme_link = %s "
                       "WHERE id = %s",
                       gm_link, carpool_id)
    
    # Send the email
    email_msg = conf_email.set_gm_email_content(email_address, gm_link)
    conf_email.send_gm_confirmation_email(email_msg)
    
    conn.commit()


# Verify that the user-inputted confirmation code matches the one emailed earlier,
#   and email the GroupMe link.
#
# @return A validation message if the code matches and an email was sent, or invalid otherwise.
class VerifyCodeAndSendGroupLink(Resource):
    def post(self):
        # Get the data included in the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        # Grab the emailed code from the database if it was sent less than 1 hour ago
        passenger_id = inst['passenger_id']
        cursor.execute("SELECT email, code "
                       "FROM passengers "
                       "WHERE passenger_id = %s"
                       "AND NOW() < DATE_ADD(created_at, INTERVAL 1 HOUR)",
                       passenger_id)
        rows = cursor.fetchall()
        conn.commit()

        if (rows[1] == inst['code']):
            send_carpool_email(passenger_id, rows[0])
            return {'message':'Confirmation code validated, email to join carpool sent'}, 200
        else:
            return {'message':'Invalid confirmation code'}, 401


# class LeaveCarpool(Resource):
#     def post(self, passenger_id):
#         # Get the data included in the post request
#         data = request.get_json(silent=True)
#         data = str(data).replace("\'", "\"")
#         inst = json.loads(str(data))

#         # TODO: Remove passenger from database

#         email_msg = conf_email.set_leave_gm_content() #TODO: params
#         conf_email.send_gm_confirmation_email(email_msg)
    
#         conn.commit()


# curl http://localhost:5000/carpools/1 -d "data={'id': 1, 'help':2}" -X POST
# curl http://localhost:5000/carpools/1 -d "data={\"id\": 1, \"help\":2}" -X POST
api.add_resource(GetAllDatabaseCarpools, '/')
api.add_resource(AddCarpoolToDatabase, '/carpool')
api.add_resource(JoinCarpool, '/carpool/join/<string:carpool_id>')
api.add_resource(SendVerificationEmail, '/confirmemail')
api.add_resource(VerifyCodeAndSendGroupLink, '/confirmemail/verifycode')
# api.add_resource(LeaveCarpool, '/carpool/leave/<string:passenger_id>')

if __name__ == '__main__':
    # Turn on the app
    app.run(debug=True)

    # Clean up
    cursor.close()
    conn.close()
    print("Done.")
