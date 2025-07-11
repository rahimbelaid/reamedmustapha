const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const TOKEN_PATH = path.join(__dirname, 'token.json');

// Remplace par ton propre chemin vers les identifiants téléchargés depuis Google
const CREDENTIALS = require('./credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function authorize() {
  const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed || CREDENTIALS.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Vérifie si un token est déjà stocké
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('💬 Autorise cette app via ce lien :\n', authUrl);

    // L’utilisateur devra coller le code ici
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question('📥 Entre le code ici : ', (code) => {
      readline.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('❌ Erreur récupération token :', err);
        oAuth2Client.setCredentials(token);

        // Sauvegarde du token
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('✅ Token enregistré dans', TOKEN_PATH);
      });
    });
  }
}

module.exports = authorize;