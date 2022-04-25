# Creates a bot that can send messages into the given GroupMe chat
#
# Author: Sarah Zhang

from traceback import print_tb
import requests
from datetime import datetime
import config


"""Helper function to format the date into a user-friendly string.

:param time: The date (in digits): ##-##
:returns: The date (in words).
"""
def format_date(date):
    date_format = datetime.strptime(date, '%m%d%Y')
    date_str = datetime.strftime(date_format, '%B %d, %Y')
    return date_str


"""Helper function to format the time into a user-friendly string.

:param time: The time (24 hour format).
:returns: The time (12 hour format).
"""
def format_time(time):
    time_format = datetime.strptime(time, '%H:%M:%S')
    time_str = datetime.strftime(time_format, '%I:%M %p')
    return time_str


"""Helper function to format the carpool info into a message.

:param carpool_info: The date, time, destination, and departure location of the carpool.
:returns: The message text.
"""
def get_carpool_info_message(carpool_info):
    carpool_date = format_date(carpool_info['month'] + carpool_info['day'] + carpool_info['year'])
    carpool_time = format_time(carpool_info['time'])

    msg_txt = "Your carpool to {} will depart from {} on {} at {}.".format(
        carpool_info['destination'],
        carpool_info['departure'],
        carpool_date,
        carpool_time
    )

    return msg_txt


"""Creates a new chat bot in the given GroupMe.

:param group_id: The id of the GroupMe chat.
:returns: The id of the new bot.
"""
def create_chat_bot(group_id):
    bot_params = {
        "bot[name]" : "Vandy Transit Bot",
        "bot[group_id]" : group_id
    }

    # Create the bot
    response = requests.post(url=config.gm_api_create_bot_url, params=bot_params)
    if response.status_code != 201:
        return response.status_code

    response_dict = response.json()
    bot_id = response_dict['response']['bot']['bot_id']
    print("Bot_id 1:", bot_id)
    return bot_id


"""Sends the welcome chat message with the carpool info.

:param carpool_info: The date, time, destination, and departure location of the carpool.
:param group_id: The id of the GroupMe chat.
"""
def send_first_chat_message(carpool_info, bot_id):
    # Create a message with all the carpool information
    print("We made it to sending a chat message")

    msg_txt = "Welcome to the chat! " + get_carpool_info_message(carpool_info)

    msg_txt = msg_txt + "\n\nVandy Transit Carpools does not monitor this chat. If you wish to leave the carpool or change the date, time, or departure location, then communicate with others in this chat."

    msg_params = {
        "bot_id" : bot_id,
        "text" : msg_txt
    }

    print("message params: ", msg_params)

    # Send the message
    response = requests.post(url=config.gm_api_send_bot_msg_url, params=msg_params)
    return response.status_code == 202


"""Sends a reminder message with the carpool info.

:param carpool_info: The date, time, destination, and departure location of the carpool.
:param group_id: The id of the GroupMe chat.
"""
def send_reminder_message(carpool_info, bot_id):
    # Create a message with all the carpool information
    msg_txt = "Reminder: " + get_carpool_info_message(carpool_info)

    msg_params = {
        "bot_id" : bot_id,
        "text" : msg_txt
    }

    # Send the message
    response = requests.post(url=config.gm_api_send_bot_msg_url, params=msg_params)
    return response.status_code == 202