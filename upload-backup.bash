#!/bin/bash
# This script enables the user to upload a file to Google Drive

# FIRST RUN THIS COMMAND TO MOVE IT TO BIN FOLDER AND WITH THE RIGHT
#sudo chmod 755 upload-backup.bash && mv upload-backup.bash ~/bin/
#sudo mv upload-backup.bash upload-backup

# Get code (one time)
# https://accounts.google.com/o/oauth2/auth?client_id=952931607675-cml1jaa80qc3d8ueqdvu4fj5bt1bljfi.apps.googleusercontent.com&redirect_uri=http://localhost&scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline
CODE=4%2F0AdQt8qiPIe6TZCBvnellajmax9IP6Du4fEXmMwYiPWMv22op5QxEgovZVajoWHIASPSgjA

# https://console.cloud.google.com/apis/credentials/oauthclient/952931607675-cml1jaa80qc3d8ueqdvu4fj5bt1bljfi.apps.googleusercontent.com?authuser=1&project=quick-sonar-311722
CLIENT_ID=952931607675-cml1jaa80qc3d8ueqdvu4fj5bt1bljfi.apps.googleusercontent.com
CLIENT_SECRET=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
SCOPE=https://www.googleapis.com/auth/drive.file

# from GET_FRESH_TOKEN() function below
REFRESH_TOKEN=1//0963W87CcBiAbCgYIARAAGAkSNwF-L9Irv0j8wqfejd70Y644QGenczCXgyyHv7mKaNc03y62IP4Qwb99ruRkayp0a7Mi-mevYuQ


# get refrech token
function GET_FRESH_TOKEN() {
    local REQUEST=$(curl -s --request POST --data "code=$CODE&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&redirect_uri=http://localhost&grant_type=authorization_code" https://oauth2.googleapis.com/token)
    local FRESH_TOKEN=$(echo $REQUEST | jq -r '.refresh_token')
    echo $FRESH_TOKEN
}

# get access token from a refrech token
function GENERATE_ACCESS_TOKEN() {
    local REQUEST=$(curl -s --request POST --data "client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&refresh_token=$REFRESH_TOKEN&grant_type=refresh_token" https://oauth2.googleapis.com/token)
    local ACCESS_TOKEN=$(echo $REQUEST | jq -r '.access_token')
    echo $ACCESS_TOKEN
}

# access token
ACCESS_TOKEN=$(GENERATE_ACCESS_TOKEN)

# sqlite3 database file path
DB_FILE=/var/www/les-experts/api-les-experts/config/env/.tmp/prod.db

# google drive folder id
FOLDER_ID=18jJMLOWepmBKAi8afmzuBp7VXJu2w0pe

# current tunisia time
NOW=$(date +%F_%H-%M-%S)

function CREATE_FOLDER() {
    # create folder 
    local REQUEST=$(curl -s -X POST -L \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "metadata={name : '$NOW', parents: ['$FOLDER_ID'], mimeType: 'application/vnd.google-apps.folder'};type=application/json;charset=UTF-8" \
    "https://www.googleapis.com/upload/drive/v3/files")
    echo $REQUEST
}

function UPLOAD_DB_FILE() {
    #upload db file to a specific folder pass on argument $1
    local REQUEST=$(curl -s -X POST -L \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "metadata={name : '$NOW.db', parents: ['$1']};type=application/json;charset=UTF-8" \
    -F "file=@$DB_FILE;type=application/octet-stream" \
   "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
   echo $REQUEST
}


# upload sqlite db to google drive
function UPLOAD_DB() {
    CREATING_FOLDER_RESPONSE=$(CREATE_FOLDER)
    # if folder created successfully this variable will contain "drive#file" value
    FOLDER_CREATED=$(echo $CREATING_FOLDER_RESPONSE | jq -r '.kind')
    
    # test if folder created
    if [ "drive#file" == "$FOLDER_CREATED" ]; then

        FOLDER_ID=$(echo $CREATING_FOLDER_RESPONSE | jq -r '.id')

        # uplaoding file to google drive inside the folder that created earlier
        RESPONSE=$(UPLOAD_DB_FILE $FOLDER_ID)

        # if file created successfully this variable will contain "drive#file" value
        FILE_CREATED=$(echo $RESPONSE | jq -r '.kind')

        if [ "drive#file" == "$FILE_CREATED" ]; then

            FILE_NAME=$(echo $RESPONSE | jq -r '.name')
            echo "$FILE_NAME file uploaded successfully!"

        else
            echo "problem with uploading this file!"
        fi
        
    else
        echo "problem with creating folder"
    fi
}

echo $(UPLOAD_DB)