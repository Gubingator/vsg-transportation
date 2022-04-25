# Testing groupme_bot.py
#
# Author: Sarah Zhang

import pytest
import groupme_bot

carpool_info = {
        "month" : "01",
        "day" : "02",
        "year" : "2023",
        "time" : "04:00:00",
        "destination" : "BNA Airport",
        "departure" : "Hank Circle"
}

def test_create_chat_bot_valid():
    bot_id = groupme_bot.create_chat_bot("86698899")
    assert type(bot_id) != int

def test_create_chat_bot_invalid():
    err_code = groupme_bot.create_chat_bot("yeet")
    assert err_code == 401

def test_send_first_chat_message():
    response = groupme_bot.send_first_chat_message(carpool_info, "a9a360e6ce934c6e481f00008d")
    assert response == True

def test_send_reminder_message():
    response = groupme_bot.send_reminder_message(carpool_info, "a9a360e6ce934c6e481f00008d")
    assert response == True