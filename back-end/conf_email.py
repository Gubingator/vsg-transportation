# Group Number: 5
# Members: Sarah Zhang, Katie Cella, Bing Gu, Ethan Piper
# sarah.s.zhang@vanderbilt.edu, katharine.a.cella@vanderbilt.edu, bing.q.gu@vanderbilt.edu, ethan.b.piper@vanderbilt.edu
# Homework 03

# Sends all the different confirmation emails for the carpool feature.
#   1. Emails the user a confirmation code, and verifies that the inputted code matches.
#   2. Creates a new GroupMe group chat, and sends an email to recipient with the link.
#
# Author: Sarah Zhang

import secrets, string
import re
import requests
import smtplib
from email.message import EmailMessage
import config


"""Generates a 6-character verification code."""
def get_verification_code():
    alphanum = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphanum) for i in range(6))


"""Checks if the user email is a valid vanderbilt.edu email address.

:param recipient: The email address to check.
:returns: True if the email address is a vanderbilt.edu email, False otherwise.
"""
def is_valid_email_address(email):
    regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

    if not re.search(regex, email):
        return False
    
    domain = email.split('@')[1]
    return domain == "vanderbilt.edu"


"""Sets the content of the user verification email based on the template.

:param verification_code: The confirmation code.
:param recipient: The email of the user/recipient.
:returns: The email message.
"""
def set_verify_email_content(verification_code, recipient):
    msg = EmailMessage()
    with open("resources\\verify-email-template.txt") as emailfile:  # TODO: May need to change path
        data = emailfile.read()
        data = data.replace("verification_code", verification_code)
        msg.set_content(data)
    msg['Subject'] = 'Vandy Transit Carpools: Confirm Your Email'
    msg['From'] = config.sender
    msg['To'] = recipient
    return msg


"""Creates a new GroupMe group chat, and returns the group id and the link.

:returns: The group id, and the link to join the new GroupMe chat.
"""
def create_groupme_chat():
    gm_content = {
        "name" : "Vandy Transit Carpool Group",
        "share" : True
    }
    response = requests.post(url=config.gm_api_groups_url, params=gm_content)
    response_dict = response.json()
    group_id = joingroup_link = response_dict['response']['group_id']
    joingroup_link = response_dict['response']['share_url']
    return group_id, joingroup_link


"""Sets the content of the GroupMe confirmation email based on the template.

:param recipient: The email of the user/recipient.
:param gm_link: The link to join the GroupMe chat.
:returns: The email message.
"""
def set_gm_email_content(recipient, gm_link):
    msg = EmailMessage()
    with open("resources\\gm-email-template.txt") as emailfile: # TODO: Maybe add back-end\\ back in
        data = emailfile.read()
        data = data.replace("gm_link", gm_link)
        msg.set_content(data)
    msg['Subject'] = 'Carpool Group Confirmation'
    msg['From'] = config.sender
    msg['To'] = recipient
    return msg


"""Sets the content of the carpool cancellation email based on the template.

:param recipient: The email of the user/recipient
:param gm_id: The id of the GroupMe group chat stored in the database.
:param mem_id: The membership id of the user in the GroupMe group chat.
:returns: The email message if successful.
"""
# def set_leave_gm_content(recipient, gm_id, mem_id):
#     # gm_content = {
#     #     'group_id': gm_id,
#     #     'membership_id': mem_id
#     # }
#     leave_group_url = config.gm_api_groups_url + f"/{gm_id}/members/{mem_id}/remove"
#     response = requests.post(url=leave_group_url)

#     msg = EmailMessage()
#     if response.status_code == 200:
#         with open("back-end\\resources\\leave-gm-email-template.txt") as emailfile:
#             data = emailfile.read()
#             msg.set_content(data)
#         msg['Subject'] = 'Carpool Cancellation Confirmation'
#         msg['From'] = config.sender
#         msg['To'] = recipient

#     return msg


"""Sends an email to the user.

:param msg: The email message.
"""
def send_email(msg):
    with smtplib.SMTP('smtp.gmail.com', 587) as smtpObj:
        smtpObj.starttls()
        smtpObj.login(config.sender, config.sender_password)
        smtpObj.send_message(msg)
        smtpObj.quit()