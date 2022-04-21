from datetime import datetime
from distutils.log import debug
from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import mysql.connector
from mysql.connector import errorcode
from flask_restful import Resource, Api
from flask_cors import CORS
import json
import config, conf_email


print("We started the app")

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


# Sends an email with the confirmation code to the user,
#   and inserts the user and code into the passengers database.
#
# @param carpool_id   The id of the carpool stored in the database
# @param email_address  The email address of the user
def send_confirmation_code_email(carpool_id, email_address):
    # Create a verification code
    verification_code = conf_email.get_verification_code()

    with conn.cursor(buffered=True) as cursor:
        # Insert the verification code into the database
        cursor.execute("INSERT INTO passengers "
                    "(carpool_id, email, code) "
                    "VALUES (%s, %s, %s);",
                    carpool_id, email_address, verification_code)
    
        conn.commit()
        cursor.close()

    # Send email with the confirmation code
    msg = conf_email.set_verify_email_content(verification_code, email_address)
    conf_email.send_email(msg)


# Sends an email with the GroupMe carpool link. If the carpool does not yet have a
#   GroupMe chat, then a new one is created.
#
# @param carpool_id   The id of the carpool stored in the database
# @param email_address  The email address of the user
def send_carpool_email(carpool_id, email_address):
    with conn.cursor(buffered=True) as cursor:
        # Join Carpool: If the carpool already has a GroupMe chat, then get the link
        cursor.execute("SELECT groupme_link "
                    "FROM carpools "
                    "WHERE id = %s",
                    carpool_id)
        gm_link = cursor.fetchone()

        # Schedule Carpool: If the carpool does not have a GroupMe chat,
        #   then create a new chat and add the link to the database
        if gm_link == None:
            gm_link = conf_email.create_groupme_link()
            cursor.execute("UPDATE carpools "
                        "SET groupme_link = %s "
                        "WHERE id = %s",
                        gm_link, carpool_id)
        
        conn.commit()
        cursor.close()
    
    # Send the email
    email_msg = conf_email.set_gm_email_content(email_address, gm_link)
    conf_email.send_email(email_msg)


# Construct connection string
conn = None
cursor = None
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

cursor.close()

app = Flask(__name__)
api = Api(app)
CORS(app, resource={r"/*": {"origins": "*"}})


# Resets the database (carpools and passengers tables).
#
# @return True if successful.
class ResetDatabase(Resource):
    def get(self):
        with conn.cursor(buffered=True) as cursor:
            with open('setup_db.sql', 'r') as sql_file:
                cursor.execute(sql_file.read())
            
            print("Reset the database tables.")

            conn.commit()
            cursor.close()
        return {'confirm': 'True'}


# Adds example data into the carpools table.
#
# @return True if successful.
class AddExampleData(Resource):
    def get(self):
        with conn.cursor(buffered=True) as cursor:

            # Insert some data into table
            with open('back-end\\test\\test_setup_db.sql', 'r') as sql_file:
                cursor.execute(sql_file.read())
            
            print("Inserted ", cursor.rowcount, " row(s) of data.")

            conn.commit()
            cursor.close()

        return {'AddedData': 'True'}


# Delete all carpools that have already occurred,
#   get all the carpools from the database, and send them to the web-app
#
# @return The list of carpools in JSON format
class GetAllUpdatedDatabaseCarpools(Resource):
    def post(self):
        rows = None
        with conn.cursor(buffered=True) as cursor:

            # Delete carpools from the database that have already occurred
            cursor.execute("DELETE FROM carpools "
                "WHERE date_time < NOW();")

            # Only display verified carpools
            cursor.execute("SELECT * FROM carpools "
                        "WHERE "
                        "ORDER BY date_time;")
            rows = cursor.fetchall()

            cursor.close()
        return {'carpools': parse_carpool_set_sql(rows)}


# Get the new carpool from the web-app and add to the database
#
# @return The new to give the carpool object that the database assigned to it.
class AddCarpoolToDatabase(Resource):
    def post(self):
        # Get the Data from the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))
        print(inst)

        rows = None
        # Insert the data into the database
        with conn.cursor(buffered=True) as cursor:
            # Format the date so that we can add it in the database
            the_date = inst['year'] + "-" + inst['month'] + "-" + inst['day'] + " " + inst['time']
            
            cursor.execute(
                "INSERT INTO carpools "
                "(departure, destination, date_time) "
                "VALUES (%s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
                (inst['departure'], inst['destination'], the_date))

            # Get the last inserted id in the database.
            # Since the id has the autoincrement property in the table, we need to make sure
            # the ids on the database and web-app side are consistent
            cursor.execute("SELECT LAST_INSERT_ID();")
            rows = cursor.fetchall()
            # Commit the data
            conn.commit()
            cursor.close()


        # Return the new id
        return {'id': rows[0][0]}


# Delete the carpool at the id specified
#
# @param carpool_id The id of the carpool to be deleted
class DeleteCarpool(Resource):
    def delete(self, carpool_id):
        with conn.cursor(buffered=True) as cursor:
            cursor.execute("DELETE FROM carpools WHERE id = %s",
                        list(carpool_id))
            conn.commit()
            cursor.close()


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

        carpool_id = inst['carpool_id']
        email = inst['email']

        rows = None
        with conn.cursor(buffered=True) as cursor:
            # Grab the emailed code from the database if it was sent less than 1 hour ago
            cursor.execute("SELECT code "
                        "FROM passengers "
                        "WHERE carpool_id = %s "
                        "AND email = %s "
                        "AND NOW() < DATE_ADD(created_at, INTERVAL 1 HOUR)",
                        carpool_id, email)
            rows = cursor.fetchall()
            conn.commit()
            cursor.close()

        # Check if the inputted code matches the code in the database
        if (rows[1] == inst['code']):
            with conn.cursor(buffered=True) as cursor:
                # Update the passenger as verified in the database
                cursor.execute("UPDATE passengers "
                            "SET verified = TRUE "
                            "WHERE carpool_id = %s "
                            "AND email = %s ",
                            carpool_id, email)

                # Update the number of filled seats in the database
                cursor.execute("UPDATE carpools "
                            "SET filled_seats = filled_seats + 1 "
                            "WHERE id = %s ",
                            carpool_id)

                conn.commit()
                cursor.close()

            # Send the confirmation email
            send_carpool_email(carpool_id, email)

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


class Test(Resource):
    def get(self):
        return {'Name': 'Jeff3'}

api.add_resource(GetAllUpdatedDatabaseCarpools, '/')
api.add_resource(AddCarpoolToDatabase, '/carpool')
api.add_resource(DeleteCarpool, '/carpool/delete/<string:carpool_id>')
api.add_resource(Test, '/test')
api.add_resource(ResetDatabase, '/reset')
api.add_resource(AddExampleData, '/example')


if __name__ == '__main__':
    app.run(debug=True)
    # Clean up
    conn.close()
    print("Done")