from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import os

# Access Azure key vault
keyvaulturi = "https://vandytransit-keys.vault.azure.net/"
kv_client = SecretClient(vault_url = keyvaulturi, credential=DefaultAzureCredential())

# Connection string information for our database
db_config = {
    'host': 'carpool-test.mysql.database.azure.com',
    'user': os.environ['config_user'],
    'password': os.environ['config_password'],
    'database': os.environ['config_database']
}

# Access GroupMe API
gm_access_token = kv_client.get_secret("gm-api-token").value
gm_api_groups_url = f"https://api.groupme.com/v3/groups?access_token={gm_access_token}"
gm_api_create_bot_url = f"https://api.groupme.com/v3/bots?token={gm_access_token}"
gm_api_send_bot_msg_url = f"https://api.groupme.com/v3/bots/post?token={gm_access_token}"

# Email information
sender = "vandytransitcarpool@gmail.com"
sender_password = kv_client.get_secret("email-pword").value