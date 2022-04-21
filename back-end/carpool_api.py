from datetime import datetime, timedelta
from distutils.log import debug
from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import mysql.connector
from mysql.connector import errorcode
from flask_restful import Resource, Api
from flask_cors import CORS
import json
import config, conf_email
import os
import re
import pytz

VALID = 1
INCORRECT_FORMAT = -1
OUT_OF_RANGE = -2
#
# os.environ['config_user'] = 'carpooltest'
# os.environ['config_password'] = 'e[zV4.]TM$p@MaHK'
# os.environ['config_database'] = 'carpools'

os.environ['config_user'] = 'newFeatureTest'
os.environ['config_password'] = 'testingFeatures1234'
os.environ['config_database'] = 'carpools'



print("We started the app")

student_delimiter = ", "


# Parse the output from the database and turn into a JSON that can
# be used by the web-application
#
# @param carpool the set of carpools from the database
# @return The list of carpools in the correct format
def parse_carpool_set_sql(carpool):
    print(carpool)
    to_return = []
    for carpool_1 in carpool:  # Parse each carpool separately and add them to a list
        element = parse_carpool_sql(carpool_1['id'], str(carpool['departure']), str(carpool['destination']),
                                    carpool['filled_seats'], str(carpool['date_time']))
        to_return.append(element)
    return to_return


# Take one singular carpool and format it into the correct format
# that can be used in the web-app. An example of the format is below:
#
# CREATE TABLE carpools (
#     id INTEGER PRIMARY KEY AUTO_INCREMENT,
#     departure VARCHAR(255),
#     destination VARCHAR(255),
#     date_time DATETIME,
#     filled_seats INT,
#     groupme_link VARCHAR(255) DEFAULT NULL
# );
#
# @param carpool One carpool object from the database
# @return One carpool in JSON format
def parse_carpool_sql(carpool_id, departure, destination, filled_seats, date_time):
    # format: (1, The departure, The destination, filled_seats, 2022-03-21 04:00:00, link)

    the_date_time = date_time.split(" ")  # Split the date string
    the_date = the_date_time[0].split("-")
    # Create the JSON element to send to the web-app
    element = {'id': carpool_id, 'departure': departure,
               'destination': destination, 'year': the_date[0], 'month': the_date[1],
               'day': the_date[2], 'time': the_date_time[1], 'filled_seats': filled_seats}
    return element



# Sends an email with the GroupMe carpool link
#
# @param carpool_id   The id of the carpool stored in the database
# @param email_address  The email address of the user
def send_carpool_email(carpool_id, email_address):
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
    
    # Send the email
    email_msg = conf_email.set_gm_email_content(email_address, gm_link)
    conf_email.send_gm_confirmation_email(email_msg)
    
    conn.commit()


def verify_date_time(time, day, month, year):

    time_regex = re.compile(r'(([0-1][0-9])|(2[0-3])):[0-5][0-9]:00')
    if not re.search(time_regex, time):
        return INCORRECT_FORMAT
    the_time = time.split(":")
    tz_IN = pytz.timezone('US/Central')
    now = datetime.now(tz_IN)

    try:
        d1 = datetime(year, month, day, int(the_time[0]), int(the_time[1])).astimezone(tz_IN)
    except ValueError:
        return INCORRECT_FORMAT
    except:
        return INCORRECT_FORMAT

    last_time = d1 + timedelta(days=14)
    if d1 < now or d1 > last_time:
        return OUT_OF_RANGE

    return VALID


def verify_departure(departure):
    return VALID


def verify_destination(destination):
    return VALID


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


class ResetDatabase(Resource):
    def get(self):
        with conn.cursor(buffered=True) as cursor:
            # Drop previous table of same name if one exists

            cursor.execute("DROP TABLE IF EXISTS carpools;")
            print("Finished dropping table (if existed).")

            # Create table
            cursor.execute(
                "CREATE TABLE carpools "
                "(id INTEGER PRIMARY KEY AUTO_INCREMENT, "
                "departure VARCHAR(255), "
                "destination VARCHAR(255) ,"
                "date_time DATETIME, "
                "filled_seats INT, "
                "groupme_link VARCHAR(255) DEFAULT NULL);")
            print("Finished creating table.")
            conn.commit()
            cursor.close()
        return {'confirm': 'True'}


class AddExampleData(Resource):
    def get(self):
        with conn.cursor(buffered=True) as cursor:

            # Insert some data into table
            cursor.execute(
                "INSERT INTO carpools "
                "(departure, destination, filled_seats, date_time) "
                "VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
                ("Hank Circle", "Chik-fil-a", "1", "2022-3-21 4:00"))
            print("Inserted", cursor.rowcount, "row(s) of data.")
            cursor.execute(
                "INSERT INTO carpools "
                "(departure, destination, filled_seats, date_time) "
                "VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
                ("Morgan Circle", "Broadway", "1", "2022-3-21 6:00"))

            cursor.execute(
                "INSERT INTO carpools "
                "(departure, destination, filled_seats, date_time) "
                "VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
                ("EBI Circle", "BNA Airport", "1", "2022-3-22 18:00"))

            conn.commit()
            cursor.close()

        return {'AddedData': 'True'}


# Get all the carpools from the database and send them to the web-app
#
# @return The list of carpools in JSON format
class GetAllDatabaseCarpools(Resource):
    def get(self):
        rows = None
        with conn.cursor(buffered=True, dictionary=True) as cursor:
            cursor.execute("SELECT * FROM carpools ORDER BY date_time;")
            rows = cursor.fetchall()
            cursor.close()
        return {'carpools': parse_carpool_set_sql(rows)}


# Get the new carpool from the web-app and add to the database
# This is what you will receive from the front end (what inst will be):
# {
#     id: 3,
#     departure: "Morgan Circle",
#     destination: "Something 2",
#     year: "2022",
#     month: "04",
#     day: "01",
#     time: "2:00:00",
#     filled_seats: 1,
#     email: "email@vanderbilt.edu"
#   },
#
# Return this:
# {
#     id: new_id
# }
# TODO: This function will send the email to the user with the code, just for schedule
#
# @return The new to give the carpool object that the database assigned to it.
class AddCarpoolToDatabase(Resource):
    def post(self):
        # Get the Data from the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))
        print(inst)

        valid_data = verify_date_time(inst['time'], inst['day'], inst['month'], inst['year'])

        if valid_data != VALID:  # VALID = 1 and is declared at the top of the file
            return {'id': valid_data}

        valid_data = verify_departure(inst['departure'])

        if valid_data != VALID:
            return {'id': valid_data}

        valid_data = verify_destination(inst['destination'])

        if valid_data != VALID:
            return {'id': valid_data}

        # Format the time, students, and date so that we can add it in the database
        the_time = inst['time'].split(":")
        the_date = inst['year'] + "-" + inst['month'] + "-" + inst['day'] + " " + the_time[0] + ":" + the_time[1]

        rows = None
        # Insert the data into the database
        with conn.cursor(buffered=True) as cursor:
            cursor.execute(
                "INSERT INTO carpools "
                "(departure, destination, date_time) "
                "VALUES (%s, %s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
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


# TODO: Send the email to the student with the code, but just for join.
#
# This is what data (or inst) will look like:
# {
#    carpool_id: id,
#    name: "Student name",
#    email: "email@vanderbilt.edu"
# }
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
        new_carpool = None
        with conn.cursor(buffered=True) as cursor:
            cursor.execute("SELECT * FROM carpools WHERE id = %s;", list(carpool_id))
            rows = cursor.fetchall()


            # Update the carpool in the database
            cursor.execute("UPDATE carpools "
                        "SET student_list = %s "
                        "WHERE id = %s",
                        (str(new_carpool[1]), carpool_id))
            conn.commit()
            cursor.close()
        
        return {'carpool': parse_carpool_sql(new_carpool)}


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


# TODO: Make a helper function to Send an email to the user with a confirmation code
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

        with conn.cursor(buffered=True) as cursor:
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
            cursor.close()


# Verify that the user-inputted confirmation code matches the one emailed earlier,
#   and email the GroupMe link.
#
# This is what inst will look like:
# {
#    carpool_id: id
#    code: "code"
#    name: "Student name",
#    email: "email@vanderbilt.edu"
# }
#
# TODO: Return {'confirm': 1} if it worked otherwise {'confirm': 0} if it didn't work
# @return A validation message if the code matches and an email was sent, or invalid otherwise.
class VerifyCodeAndSendGroupLink(Resource):
    def post(self):
        # Get the data included in the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        # Grab the emailed code from the database if it was sent less than 1 hour ago
        carpool_id = inst['carpool_id']
        email = inst['email']

        rows = None
        with conn.cursor(buffered=True) as cursor:
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
            # Update the passenger as verified in the database
            with conn.cursor(buffered=True) as cursor:
                cursor.execute("UPDATE passengers "
                            "SET verified = TRUE"
                            "WHERE carpool_id = %s "
                            "AND email = %s ",
                            carpool_id, email)
                rows = cursor.fetchall()
                conn.commit()
                cursor.close()

            # Send the confirmation email
            send_carpool_email(carpool_id, rows[0])
            
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

api.add_resource(GetAllDatabaseCarpools, '/')
api.add_resource(AddCarpoolToDatabase, '/carpool')
api.add_resource(JoinCarpool, '/carpool/join/<string:carpool_id>')
api.add_resource(DeleteCarpool, '/carpool/delete/<string:carpool_id>')
api.add_resource(Test, '/test')
api.add_resource(ResetDatabase, '/reset')
api.add_resource(AddExampleData, '/example')
api.add_resource(SendVerificationEmail, '/sendVerificationEmail')
api.add_resource(VerifyCodeAndSendGroupLink, '/verifyCode')


if __name__ == '__main__':
    app.run(debug=True)
    # Clean up
    conn.close()
    print("Done")