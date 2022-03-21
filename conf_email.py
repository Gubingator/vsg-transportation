# Creates a new GroupMe group chat, and sends an email to recipient with the link.
#
# Author: Sarah Zhang

from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import requests
import smtplib
from email.message import EmailMessage


# Access Azure key vault
keyvaulturi = "https://vandytransit-keys.vault.azure.net/"
kv_client = SecretClient(vault_url = keyvaulturi, credential=DefaultAzureCredential())


"""Helper function that creates a new GroupMe group chat, and returns the link.

:returns: The link to join the new GroupMe chat.
"""
def get_groupme_link():
    gm_access_token = kv_client.get_secret("gm-api-token").value
    gm_api_groups_url = f"https://api.groupme.com/v3/groups?access_token={gm_access_token}"
    gm_content = {
        "name" : "Vandy Transit Carpool Group",
        "share" : True
    }
    response = requests.post(url=gm_api_groups_url, params=gm_content)
    response_dict = response.json()
    joingroup_link = response_dict.get('response', {}).get('share_url')
    return joingroup_link


"""Helper function that sets the content of the confirmation email based on the template.

:param sender: The email of the sender.
:param recipient: The email of the user/recipient.
:returns: The email message.
"""
def set_email_content(sender, recipient):
    msg = EmailMessage()
    with open("confirmation-template.txt") as emailfile:
        data = emailfile.read()
        data = data.replace("gm_link", get_groupme_link())
        msg.set_content(data)
    msg['Subject'] = 'Carpool Group Confirmation'
    msg['From'] = sender
    msg['To'] = recipient
    return msg


"""Sends a confirmation email to the user.

:param user_email: The email of the user/recipient.
"""
def send_confirmation_email(user_email):
    sender = "vandytransitcarpool@gmail.com"
    recipient = user_email
    password = kv_client.get_secret("email-pword").value

    msg = set_email_content(sender, recipient)

    with smtplib.SMTP('smtp.gmail.com', 587) as smtpObj:
        smtpObj.starttls()
        smtpObj.login(sender, password)
        smtpObj.send_message(msg)
        smtpObj.quit()