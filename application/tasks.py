from application.workers import celery_app
from datetime import datetime,timedelta
from celery.schedules import crontab
from jinja2 import Template
from application.email import send_email
from application.models import User,Booking,Rate,Venue
from application.database import db
from sqlalchemy.orm import aliased
import os,csv,zipfile


@celery_app.on_after_finalize.connect
def set_up_daily_task(sender, **kwargs):
   sender.add_periodic_task(crontab(hour=12, minute=3),send_dailyvisit_email.s(),name="send_dailyemail_task")


@celery_app.on_after_finalize.connect
def set_up_monthly_task(sender, **kwargs):
   sender.add_periodic_task(crontab(day_of_month='24', hour=12, minute=3),send_monthlyreport_email.s(),name="send_monthly_emailtask")




@celery_app.task()
def send_dailyvisit_email():
    user = User.query.all()
    for i in user:
        if datetime.now() - i.lastlogin >= timedelta(minutes=0):
            with open('templates/visitmail.html') as file_:
                template = Template(file_.read())
                message = template.render(name=i.username)

            send_email(
                to=i.email,
                subject="Visit mail",
                message=message
            )

    return "Emails have been sent to users who haven't loggedin for 12hrs!"


@celery_app.task()
def send_monthlyreport_email():
    users=User.query.all()
    bookedalias = aliased(Booking)
    ratealias = aliased(Rate)
    query = db.session.query(bookedalias, ratealias).join(ratealias, bookedalias.show_id == ratealias.rateshow_id)
    details=query.all()
    for user in users:
        list1=[]
        for i,j in details:
            if user.id==i.user_id:
                show={"showname":j.showname,"booked":i.number_of_bookings,"ratings":j.rating,"reviews":j.review}
                list1.append(show)
        with open('templates/monthlyreport.html') as file_:
                template = Template(file_.read())
                message = template.render(name=user.username,booked=list1)

        send_email(
                to=user.email,
                subject="Monthly Mail",
                message=message
            )
    return "Monthly Entertainment report Emails sent to all users"


@celery_app.task
def export_venue_report(v_id, to):
    ven = Venue.query.get(v_id)
    if ven:
        shows = ven.shows
        bookedalias = aliased(Booking)
        ratealias = aliased(Rate)
        query = db.session.query(bookedalias, ratealias).join(ratealias, bookedalias.show_id == ratealias.rateshow_id)
        details=query.all()
        showids = [i.id for i in shows]
        csv_data = [
            ["venuename", "Place", "location", "showname", "showsbooked", "ratings", "reviews"]
        ]
        pc = set()
        for i in showids:
            for j, k in details:
                c = (i, k.rating, k.review)
                if i == j.show_id and c not in pc:
                    csv_data.append([
                        ven.venue_name, ven.place, ven.location, k.showname, j.number_of_bookings, k.rating, k.review
                    ])
                    pc.add(c)
        
        downloads_folder = os.path.expanduser("~/Downloads")
        csv_file_path = os.path.join(downloads_folder, f'{ven.venue_name}.csv')

        mode = 'w' if not os.path.exists(csv_file_path) else 'a'
        with open(csv_file_path, mode, newline='') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerows(csv_data)

        # Zip the CSV file
        zip_file_path = os.path.join(downloads_folder, f'{ven.venue_name}.zip')
        with zipfile.ZipFile(zip_file_path, 'w') as zipf:
            zipf.write(csv_file_path, arcname=os.path.basename(csv_file_path))

        with open('templates/export.html') as file_:
            template = Template(file_.read())
            message = template.render()

        send_email(
            to=to,
            subject="exported venue report",
            message=message,
            file=zip_file_path  
        )
        return "Venue Entertainment Mail Sent to User/admin!!"