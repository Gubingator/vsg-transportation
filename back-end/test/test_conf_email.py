# Testing conf_email.py
#
# Author: Sarah Zhang

import pytest
import config, conf_email

def test_get_verification_code():
    code = conf_email.get_verification_code()
    assert len(code) == 6
    assert code.isalnum

def test_is_valid_email_address_with_validemail():
    valid_email = "example.2@vanderbilt.edu"
    assert conf_email.is_valid_email_address(valid_email)

def test_is_valid_email_address_with_invalidemaildomain():
    invalid_email = "example@gmail.com"
    assert conf_email.is_valid_email_address(invalid_email) == False

def test_is_valid_email_address_with_invalidstring():
    invalid_string = "invalid"
    assert conf_email.is_valid_email_address(invalid_string) == False

def test_set_verify_email_content():
    code = '000000'
    valid_email = "example@vanderbilt.edu"
    message = conf_email.set_verify_email_content(code, valid_email)

    with open("back-end\\resources\\verify-email-template.txt") as emailfile:
        data = emailfile.read()
        data = data.replace("verification_code", code)
        assert message.get_content() == data + '\n'
    
    assert message['Subject'] == 'Vandy Transit Carpools: Confirm Your Email'
    assert message['From'] == config.sender
    assert message['To'] == valid_email

def test_create_groupme_link():
    link = conf_email.create_groupme_link()
    assert link.startswith("https://app.groupme.com/join_group/")

def test_set_gm_email_content():
    recipient = "example@vanderbilt.edu"
    gm_link = "testlink"

    msg = conf_email.set_gm_email_content(recipient, gm_link)
    with open("back-end\\resources\\gm-email-template.txt") as emailfile:
        data = emailfile.read()
        data = data.replace("gm_link", gm_link)
        assert msg.get_content() == data + '\n'
    
    assert msg['Subject'] == 'Carpool Group Confirmation'
    assert msg['From'] == config.sender
    assert msg['To'] == recipient