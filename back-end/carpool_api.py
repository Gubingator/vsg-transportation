from datetime import datetime, timedelta
from distutils.log import debug
from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import mysql.connector
from mysql.connector import errorcode
from flask_restful import Resource, Api
from flask_cors import CORS
import json
import config, conf_email, groupme_bot
import re
import pytz

VALID = 1
INCORRECT_FORMAT = -1
OUT_OF_RANGE = -2

print("Started the app")

student_delimiter = ", "


# Parse the output from the database and turn into a JSON that can
# be used by the web-application
#
# @param carpool the set of carpools from the database
# @return The list of carpools in the correct format
def parse_carpool_set_sql(carpool):
    to_return = []
    for carpool_1 in carpool:
        # Parse each carpool separately and add it to a list
        element = parse_carpool_sql(
            carpool_1['id'],
            str(carpool_1['departure']),
            str(carpool_1['destination']),
            carpool_1['filled_seats'],
            str(carpool_1['date_time'])
        )
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
#     filled_seats INTEGER DEFAULT 0,
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
    element = {
        'id': carpool_id,
        'departure': departure,
        'destination': destination,
        'year': the_date[0],
        'month': the_date[1],
        'day': the_date[2],
        'time': the_date_time[1],
        'filled_seats': filled_seats
    }
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
                    (carpool_id, email_address, verification_code))
    
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
                       "FROM groupme_info "
                       "WHERE carpool_id = %s",
                       list([str(carpool_id)]))
        gm_link = cursor.fetchone()[0]
        
        conn.commit()
        cursor.close()

    # Schedule Carpool: If the carpool does not have a GroupMe chat,
    #   then create a new chat and add the info to the database
    if gm_link is None:
        group_id, gm_link = conf_email.create_groupme_chat()
        bot_id = groupme_bot.create_chat_bot(group_id)
        
        with conn.cursor(buffered=True) as cursor:
            cursor.execute("INSERT INTO groupme_info "
                           "VALUES (%s, %s, %s, %s); ",
                           (group_id, carpool_id, bot_id, gm_link))

            # Get carpool logistical info to send a message to the GroupMe chat
            cursor.execute("SELECT * FROM carpools WHERE carpool_id = %s;",
                           list([str(carpool_id)]))
            rows = cursor.fetchall()
            carpool_info = parse_carpool_set_sql(rows)
            groupme_bot.send_first_chat_message(carpool_info, bot_id)

            conn.commit()
            cursor.close()

    # Send the email
    email_msg = conf_email.set_gm_email_content(email_address, gm_link)
    conf_email.send_email(email_msg)


# Verifies that the datetime is valid
def verify_date_time(time, day, month, year):

    time_regex = re.compile(r'(([0-1][0-9])|(2[0-3])):[0-5][0-9]:00')
    if not re.search(time_regex, time):
        return INCORRECT_FORMAT
    the_time = time.split(":")
    tz_IN = pytz.timezone('US/Central')
    now = datetime.now(tz_IN)

    try:
        d1 = datetime(int(year), int(month), int(day), int(the_time[0]), int(the_time[1])).astimezone(tz_IN)
    except ValueError: 
        return INCORRECT_FORMAT
    except:
        return INCORRECT_FORMAT

    last_time = d1 + timedelta(days=14)
    if d1 < now or d1 > last_time:
        return OUT_OF_RANGE

    return VALID


# Verifies that the departure location is valid
def verify_departure(departure):
    return VALID


# Verifies that the destination location is valid
def verify_destination(destination):
    return VALID


# Verifies that the carpool input info is valid
def verify_carpool_input_info(time, day, month, year, departure, destination):
    valid_data = verify_date_time(time, day, month, year)

    if valid_data != VALID:
        return valid_data

    valid_data = verify_departure(departure)

    if valid_data != VALID:
        return valid_data

    valid_data = verify_destination(destination)

    if valid_data != VALID:
        return valid_data

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

app = Flask(__name__)
api = Api(app)
CORS(app, resource={r"/*": {"origins": "*"}})


# Resets the database (carpools and passengers tables).
#
# @return True if successful.
class ResetDatabase(Resource):
    def get(self):
        with conn.cursor(buffered=True) as cursor:
            # with open('setup_db.sql', 'r') as sql_file:
            #     cursor.execute(sql_file.read(), multi=True)

            cursor.execute("DROP TABLE IF EXISTS groupme_info;")
            cursor.execute("DROP TABLE IF EXISTS passengers; ")
            cursor.execute("DROP TABLE IF EXISTS carpools;")

            conn.commit()

            cursor.execute("CREATE TABLE carpools "
                           "(id INTEGER PRIMARY KEY AUTO_INCREMENT, "
                           "departure VARCHAR(255), "
                           "destination VARCHAR(255), "
                           "date_time DATETIME, "
                           "filled_seats INT DEFAULT 0);")

            cursor.execute("CREATE TABLE passengers "
                           "(passenger_id INTEGER PRIMARY KEY AUTO_INCREMENT, "
                           "carpool_id INTEGER, "
                           "name VARCHAR(255), "
                           "email VARCHAR(255), "
                           "code VARCHAR(255), "
                           "created_at DATETIME DEFAULT NOW(), "
                           "verified INTEGER DEFAULT FALSE, "
                           "CONSTRAINT carpool_fk "
                           "FOREIGN KEY (carpool_id) "
                           "REFERENCES carpools (id) "
                           "ON UPDATE CASCADE "
                           "ON DELETE CASCADE);")

            cursor.execute("CREATE TABLE groupme_info "
                           "(group_id INTEGER PRIMARY KEY, "
                           "carpool_id INTEGER, "
                           "bot_id INTEGER DEFAULT NULL, "
                           "groupme_link VARCHAR(255) DEFAULT NULL, "
                           "CONSTRAINT gm_fk "
                           "FOREIGN KEY (carpool_id) "
                           "REFERENCES carpools (id) "
                           "ON UPDATE CASCADE "
                           "ON DELETE CASCADE);")

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
            # with open('back-end\\test\\test_setup_db.sql', 'r') as sql_file:
            #     cursor.execute(sql_file.read())

            cursor.execute("INSERT INTO carpools "
                           "(departure, destination, date_time, filled_seats) "
                           "VALUES ( %s, %s, STR_TO_DATE( %s, '%Y-%m-%d %H:%i'), %s); ",
                           ("Hand Circle", "Chick-fil-a", "2023-3-21 4:00", "2"))

            cursor.execute("INSERT INTO carpools "
                           "(departure, destination, date_time, filled_seats) "
                           "VALUES ( %s, %s, STR_TO_DATE( %s, '%Y-%m-%d %H:%i'), %s); ",
                           ("Morgan Circle", "Broadway", "2023-3-21 6:00", "2"))

            cursor.execute("INSERT INTO carpools "
                           "(departure, destination, date_time, filled_seats) "
                           "VALUES ( %s, %s, STR_TO_DATE( %s, '%Y-%m-%d %H:%i'), %s); ",
                           ("EBI Circle", "BNA Airport", "2023-3-22 18:00", "1"))

            cursor.execute("INSERT INTO passengers "
                           "(carpool_id, email, code, created_at) "
                           "VALUES (%s, %s, %s, NOW()); ",
                           ("1", "example@vanderbilt.edu", "123456"))
            
            # TODO: Insert data into groupme_info table

            conn.commit()
            cursor.close()

        return {'AddedData': 'True'}


# Delete all carpools that have already occurred,
#   get all the carpools from the database, and send them to the web-app
#
# @return The list of carpools in JSON format
class GetAllUpdatedDatabaseCarpools(Resource):
    def get(self):
        rows = None
        with conn.cursor(buffered=True, dictionary=True) as cursor:
            # Delete carpools from the database that have already occurred
            cursor.execute("DELETE FROM carpools "
                           "WHERE date_time < NOW();")

            # TODO: Call groupme_bot.send_reminder_message() one day before the carpool

            # Only display verified carpools
            cursor.execute("SELECT * FROM carpools "
                           "WHERE filled_seats != 0 "
                           "ORDER BY date_time;")
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
#
# @return The new to give the carpool object that the database assigned to it.
class AddCarpoolToDatabase(Resource):
    def post(self):
        # Get the data from the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        # Check if input data is valid
        valid_data = verify_carpool_input_info(
            inst['time'],
            inst['day'],
            inst['month'],
            inst['year'],
            inst['departure'],
            inst['desination']
        )
        
        if valid_data != VALID:
            return { 'id' : valid_data }

        if not conf_email.is_valid_email_address(inst['email']):
            return { 'id' : -1 }

        rows = None
        # Insert the data into the database
        with conn.cursor(buffered=True, dictionary=True) as cursor:
            # Format the date so that we can add it in the database
            the_time = inst['time'].split(":")
            the_date = inst['year'] + "-" + inst['month'] + "-" + inst['day']
            date_time = the_date + " " + the_time[0] + ":" + the_time[1]
            
            cursor.execute(
                "INSERT INTO carpools "
                "(departure, destination, date_time) "
                "VALUES (%s, %s, STR_TO_DATE(%s, '%Y-%m-%d %H:%i'));",
                (inst['departure'], inst['destination'], date_time))

            # Get the last inserted id in the database.
            # Since the id has the autoincrement property in the table, we need to make sure
            # the ids on the database and web-app side are consistent
            cursor.execute("SELECT LAST_INSERT_ID();")
            rows = cursor.fetchall()

            # Commit the data
            conn.commit()
            cursor.close()
        carpool_id = rows[0]['LAST_INSERT_ID()']

        # Send the email with the confirmation code
        send_confirmation_code_email(carpool_id, inst['email'])

        # Return the new id
        return {'id': carpool_id}


# Sends an email with the confirmation code.
#
# This is what data (or inst) will look like:
# {
#    carpool_id: id,
#    name: "Student name",
#    email: "email@vanderbilt.edu"
# }
#
# @return The new carpool to update on the front-end
class JoinCarpool(Resource):
    def post(self):
        # Get the data from the post request
        data = request.get_json(silent=True)
        data = str(data).replace("\'", "\"")
        inst = json.loads(str(data))

        if not conf_email.is_valid_email_address(inst['email']):
            return {'confirm': -1}

        send_confirmation_code_email(inst['carpool_id'], inst['email'])
        
        return {'confirm': 0}


# Delete the carpool at the id specified
#
# @param carpool_id The id of the carpool to be deleted
class DeleteCarpool(Resource):
    def delete(self, carpool_id):
        with conn.cursor(buffered=True) as cursor:
            cursor.execute("DELETE FROM carpools WHERE id = %s",
                           list([str(carpool_id)]))
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

        carpool_id = inst['carpool_id']
        email = inst['email']

        rows = None
        with conn.cursor(buffered=True, dictionary=True) as cursor:
            # Grab the emailed code from the database if it was sent less than 1 hour ago
            cursor.execute("SELECT code "
                           "FROM passengers "
                           "WHERE carpool_id = %s "
                           "AND email = %s "
                           "AND NOW() < DATE_ADD(created_at, INTERVAL 1 HOUR) "
                           "ORDER BY created_at DESC;",
                           (carpool_id, email))
            rows = cursor.fetchall()
            conn.commit()

            # Check if the inputted code matches the code in the database
            if rows[0]['code'] == inst['code']:
                # Update the passenger as verified in the database
                cursor.execute("UPDATE passengers "
                               "SET verified = TRUE "
                               "WHERE carpool_id = %s "
                               "AND email = %s ",
                               (carpool_id, email))

                # Update the number of filled seats in the database
                cursor.execute("UPDATE carpools "
                               "SET filled_seats = filled_seats + 1 "
                               "WHERE id = %s;",
                               list([str(carpool_id)]))

                conn.commit()
                cursor.close()

                # Send the confirmation email
                send_carpool_email(carpool_id, email)

                return { 'message' : 'Confirmation code validated, email to join carpool sent',
                         'confirm' : 1 }, 200
            else:
                return {'message':'Invalid confirmation code', 'confirm': 0}, 401


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
        with conn.cursor(buffered=True, dictionary=True) as cursor:
            cursor.execute("SELECT * FROM passengers;")
            rows = cursor.fetchall()
            print(rows)
        return {'passengers': 'printed'}

# {
#    carpool_id: id,
#    code: "code",
#    name: "Student name",
#    email: "email@vanderbilt.edu"
# }
# curl -d '{'carpool_id': 1, 'code': 123456, 'name': "Ethan", 'email':ethan@vanderbilt.edu}' -H 'Content-Type: application/json' http://127.0.0.1:5000/verifyCode/

api.add_resource(GetAllUpdatedDatabaseCarpools, '/')
api.add_resource(AddCarpoolToDatabase, '/carpool')
api.add_resource(DeleteCarpool, '/carpool/delete/<string:carpool_id>')
api.add_resource(Test, '/test')
api.add_resource(ResetDatabase, '/reset')
api.add_resource(AddExampleData, '/example')
api.add_resource(VerifyCodeAndSendGroupLink, '/verifyCode')
api.add_resource(JoinCarpool, '/email')


if __name__ == '__main__':
    app.run(debug=True)
    # Clean up
    conn.close()
    print("Done")