const firebaseConfig = {
    apiKey: process.env.CONFIG_API_KEY,
    authDomain: process.env.CONFIG_AUTH_DOMAIN,
    projectId: process.env.CONFIG_PROJECT_ID,
    storageBucket: process.env.CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.CONFIG_MESSAGING_ID,
    appId: process.env.CONFIG_APP_ID,
    measurementId: process.env.CONFIG_MEASUREMENT_ID
};

const firebaseSdk = {
    type: process.env.SDK_TYPE,
    project_id: process.env.SDK_PROJECT_ID,
    private_key_id: process.env.SDK_PRIVATE_KEY_ID,
    private_key: process.env.SDK_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.SDK_CLIENT_EMAIL,
    client_id: process.env.SDK_CLIENT_ID,
    auth_uri: process.env.SDK_AUTH_URI,
    token_uri: process.env.SDK_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SDK_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.SDK_CLIENT_X509_CERT_URL
};

const baseUrl = process.env.PROVINCE_URL;

module.exports = { firebaseConfig, firebaseSdk, baseUrl };