from pytz import utc
import time
import schedule
import time

# app/scheduler/__main__.py
from app import create_app
import schedule
import time
from scheduler.email_campaign import impact_email, closeout_email

app = create_app()


def run_impact_email():
    with app.app_context():
        impact_email()


def run_closeout_email():
    with app.app_context():
        closeout_email()


def main():
    print("Starting scheduler...")
    schedule.every(5).seconds.do(run_impact_email)
    schedule.every(5).seconds.do(run_closeout_email)

    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == "__main__":
    main()
