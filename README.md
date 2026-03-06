
- node cron -> schedule reminder -> crontab guru
- SMS → Twilio
- WhatsApp → Twilio WhatsApp API

`
1. `npx sequelize init` 
2. update database name and add password
3. `npx sequelize db:create` 
4. `npx sequelize model:generate --name NotificationTicket --attributes subject:string,content:string,recepientEmail:string,status:enum,notificationTime:date`

`
4. `npx sequelize model:generate --name NotificationTicket --attributes subject:string,content:string,    recepientEmail:string,status:enum,notificationTime:date`

`
