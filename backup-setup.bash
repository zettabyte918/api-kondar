#!/bin/bash

CONF_DIR="${HOME}/.config"
CRON_TEMP="${CONF_DIR}/upload-backup"
CRON_TEMP_FILE_SETUP="${CRON_TEMP}/setup"
CRON_TEMP_FILE="${CRON_TEMP}/tmp"

# cronjob for the backup process
CRON_BACKUP="@hourly /home/ubuntu/bin/upload-backup >> $HOME/backup_log.txt"

# cronjob for reboot
CRON_BACKUP_SETUP="@reboot sleep 300 && /home/ubuntu/bin/backup-setup >> $HOME/backup_log.txt"

# current full time
NOW=$(date +%F_%H-%M-%S)

# check if upload-backup config folder exists
[ ! -d "$CRON_TEMP" ] && mkdir ${CRON_TEMP}

#copy current crontab to config setup
crontab -l > "${CRON_TEMP_FILE_SETUP}"

# check if backup-setup exist
CHECK_CRON_SETUP=`cat ${CRON_TEMP_FILE_SETUP} | grep -c "backup-setup"`

function ADD_BACKUP_CRONJOB_TO_CRONTAB() {
    # check if already there is upload-backup cron
    crontab -l > "${CRON_TEMP_FILE}"
    CHECK_CRON=`cat ${CRON_TEMP_FILE} | grep -c "upload-backup"`

    if [ ${CHECK_CRON} -eq 0 ]
        then
            echo ${CRON_BACKUP} >> ${CRON_TEMP_FILE}
            crontab ${CRON_TEMP_FILE}
            if [ $? -ne 0 ]
                then
                    echo "[${NOW}] Can not setup cronjob to backup! Please check again"
                else
                    echo "[${NOW}] Setup cronjob to backup db file successful"
                fi
        else
            echo "[${NOW}] Cron backup existed. Skip"
    fi
}

if [ ${CHECK_CRON_SETUP} -eq 0 ]
    then
        echo "PATH=$PATH" >> ${CRON_TEMP_FILE_SETUP}
        echo ${CRON_BACKUP_SETUP} >> ${CRON_TEMP_FILE_SETUP}
        crontab ${CRON_TEMP_FILE_SETUP}
        if [ $? -ne 0 ]
            then
                echo "[${NOW}] Can not setup cronjob to on reboot! Please check again"
            else
                echo "[${NOW}] Setup cronjob on reboot successful"
                ADD_BACKUP_CRONJOB_TO_CRONTAB
            fi
    else
        echo "[${NOW}] Reboot cronjob already exists"
    fi

rm -f  ${CRON_TEMP_FILE_SETUP}
rm -f  ${CRON_TEMP_FILE}