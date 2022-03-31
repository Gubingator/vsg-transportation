# Creates a new GroupMe group chat, and sends an email to recipient with the link.
#
# Author: Sarah Zhang

import secrets
import requests
import smtplib
from email.message import EmailMessage
import config

# """Helper function that generates a 6-character verification code."""
# def get_verification_code():
#     secrets.token_hex(6).upper


# """Helper function that verifies the user-inputted verification code."""
# # TODO: make the verification code only valid for 1 hour
# def verify_input_code(input_code):
#     input_code


"""Helper function that sets the content of the user verification email based on the template.

:param recipient: The email of the user/recipient.
:returns: The email message.
"""
def set_verify_email_content(recipient):
    msg = EmailMessage()
    with open("verify-email-template.txt") as emailfile:
        data = emailfile.read()
        data = data.replace("verification_code", get_verification_code())
        msg.set_content(data)
    msg['Subject'] = 'Vandy Transit Carpools Verification'
    msg['From'] = config.sender
    msg['To'] = recipient
    return msg


"""Helper function that creates a new GroupMe group chat, and returns the link.

:returns: The link to join the new GroupMe chat.
"""
def get_groupme_link():
    gm_content = {
        "name" : "Vandy Transit Carpool Group",
        "share" : True
    }
    response = requests.post(url=config.gm_api_groups_url, params=gm_content)
    response_dict = response.json()
    joingroup_link = response_dict.get('response', {}).get('share_url')
    return joingroup_link


"""Helper function that sets the content of the GroupMe confirmation email based on the template.

:param sender: The email of the sender.
:param recipient: The email of the user/recipient.
:returns: The email message.
"""
def set_gm_email_content(recipient):
    msg = EmailMessage()
    with open("gm-email-template.txt") as emailfile:
        data = emailfile.read()
        data = data.replace("gm_link", get_groupme_link())
        msg.set_content(data)
    msg['Subject'] = 'Carpool Group Confirmation'
    msg['From'] = config.sender
    msg['To'] = recipient
    return msg


"""Sends a confirmation email to the user.

:param msg: The email message.
"""
def send_gm_confirmation_email(msg):
    with smtplib.SMTP('smtp.gmail.com', 587) as smtpObj:
        smtpObj.starttls()
        smtpObj.login(config.sender, config.sender_password)
        smtpObj.send_message(msg)
        smtpObj.quit()