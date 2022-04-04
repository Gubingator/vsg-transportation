from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

# Access Azure key vault
keyvaulturi = "https://vandytransit-keys.vault.azure.net/"
kv_client = SecretClient(vault_url = keyvaulturi, credential=DefaultAzureCredential())

# Access GroupMe API
gm_access_token = kv_client.get_secret("gm-api-token").value
gm_api_groups_url = f"https://api.groupme.com/v3/groups?access_token={gm_access_token}"

# Email information
sender = "vandytransitcarpool@gmail.com"
sender_password = kv_client.get_secret("email-pword").value