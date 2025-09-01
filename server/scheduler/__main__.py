from pytz import utc
import time
import schedule
import time

# app/scheduler/__main__.py
from app import create_app
import schedule
import time
from scheduler.email_campaign import impact_email, closeout_email
from scheduler.reconciliation_service import (
    reconcile_active_campaign,
    reconcile_payments,
    reconcile_refunds,
)

app = create_app()


def run_impact_email():
    with app.app_context():
        impact_email()


def run_closeout_email():
    with app.app_context():
        closeout_email()


def run_reconcile_active_campaign():
    with app.app_context():
        reconcile_active_campaign()


def run_reconcile_payments():
    with app.app_context():
        reconcile_payments()


def run_reconcile_refunds():
    with app.app_context():
        reconcile_refunds()


def main():
    print("Starting scheduler...")
    # schedule.every(5).seconds.do(run_impact_email)
    # schedule.every(5).seconds.do(run_closeout_email)
    # schedule.every(5).seconds.do(run_reconcile_active_campaign)
    schedule.every(5).seconds.do(run_reconcile_payments)
    # schedule.every(5).seconds.do(run_reconcile_refunds)

    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == "__main__":
    main()
