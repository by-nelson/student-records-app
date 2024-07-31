import AWS from 'aws-sdk';

let config = {
  APP_DB_HOST: "",
  APP_DB_USER: "",
  APP_DB_PASSWORD: "",
  APP_DB_NAME: ""
};

const client = new AWS.SecretsManager({
    region: "us-east-1"
});

const secretName = "Mydbsecret";

async function getConfig() {
  try {
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    
    if ('SecretString' in data) {
      let secret = JSON.parse(data.SecretString);
      for (const envKey of Object.keys(secret)) {
        console.log("Saving env key: " + envKey);
        process.env[envKey] = secret[envKey];
        if (envKey === 'user') {
          config.APP_DB_USER = secret[envKey];
        } else if (envKey === 'password') {
          config.APP_DB_PASSWORD = secret[envKey];
        } else if (envKey === 'host') {
          config.APP_DB_HOST = secret[envKey];
        } else if (envKey === 'db') {
          config.APP_DB_NAME = secret[envKey];
        }
      }
    }
  } catch (err) {
    config.APP_DB_HOST = "localhost";
    config.APP_DB_NAME = "STUDENTS";
    config.APP_DB_PASSWORD = "student12";
    config.APP_DB_USER = "nodeapp";
    console.log('Secrets not found. Proceeding with default values..');
  }

  Object.keys(config).forEach(key => {
    console.log("Looking for envkey: " + key);
    if (process.env[key] === undefined) {
      console.log(`[NOTICE] Value for key '${key}' not found in ENV, using default value. See app/config/config.js`);
    } else {
      config[key] = process.env[key];
    }
  });

  console.log(config);
  return config;
}

await getConfig();
export default config;
