# import pytest
# from carpool-api import app

# @pytest.fixture
# def client():
#     client = app.test_client()

#     yield client

# from azure.keyvault.secrets import SecretClient
# from azure.identity import DefaultAzureCredential

# # Access Azure key vault
# keyvaulturi = "https://vandytransit-keys.vault.azure.net/"
# kv_client = SecretClient(vault_url = keyvaulturi, credential=DefaultAzureCredential())

# import pytest
# import os
# from unittest import mock

# @pytest.fixture(autouse=True)
# def env_vars():
#     with mock.patch.dict(os.environ, {"config_user": "carpooltest"}):
#         yield
    
#     with mock.patch.dict(os.environ, {"config_password": kv_client.get_secret("db-password").value}):
#         yield
    
#     with mock.patch.dict(os.environ, {"config_database": 'carpools'}):
#         yield