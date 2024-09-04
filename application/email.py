import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication


SMTP_SERVER_HOST="localhost"
SMTP_SERVER_PORT=1025
SENDER_ADDRESS='ticketapp@gmail.com'
SENDER_PASSWORD=''

def send_email(to,subject,message,file=None):
    msgge=MIMEMultipart()
    msgge['From']=SENDER_ADDRESS
    msgge['To']=to
    msgge['Subject']=subject
    
    msgge.attach(MIMEText(message,"html"))

    if not file==None:
        with open(file, 'rb') as f:
            attach = MIMEApplication(f.read(), _subtype='zip')
            attach.add_header('Content-Disposition', 'attachment', filename=file)
            msgge.attach(attach)
    
    smtt=smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)
    smtt.login(SENDER_ADDRESS,SENDER_PASSWORD)
    smtt.send_message(msgge)
    smtt.quit()
    return True