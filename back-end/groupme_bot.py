# Creates a bot that can send messages into the given GroupMe chat
#
# Author: Sarah Zhang

import requests
import config


"""Helper function to format the carpool info into a message.

:param carpool_info: The date, time, destination, and departure location of the carpool.
:returns: The message text.
"""
def get_carpool_info_message(carpool_info):
    carpool_date = carpool_info['month'] + "-" + carpool_info['day'] + "-" + carpool_info['year']

    msg_txt = "Your carpool to {} will depart from {} on {} at {}.".format(
        carpool_info['destination'],
        carpool_info['departure'],
        carpool_date,
        carpool_info['time']
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
    return bot_id


"""Sends the welcome chat message with the carpool info.

:param carpool_info: The date, time, destination, and departure location of the carpool.
:param group_id: The id of the GroupMe chat.
"""
def send_first_chat_message(carpool_info, bot_id):
    # Create a message with all the carpool information
    msg_txt = "Welcome to the chat! " + get_carpool_info_message(carpool_info)

    msg_txt = msg_txt + "\n\nVandy Transit Carpools does not monitor this chat. If you wish to leave the carpool or change the date, time, or departure location, then communicate with others in this chat."

    msg_params = {
        "bot_id" : bot_id,
        "text" : msg_txt
    }

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