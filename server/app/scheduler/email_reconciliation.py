from app.database import db
from datetime import datetime
from flask import  current_app
from app.models.task import Task
from app.models.email import Email
from app.utils.constants import JobStatus
from datetime import datetime, timezone

from retrying import retry






# function chould call a class





@retry(wait_exponential_multiplier=1000, wait_exponential_max=10000, stop_max_attempt_number=3)
async def email_query(message_id):
    mailjet_client=current_app.mailjet
    result = mailjet_client.message.get(id=message_id)
    return result


async def email_reconciliation():
    try:
        now = datetime.now(timezone.utc)

        emails = Email.query.filter(Email.last_reconciled != now).all()
       
        for email in emails:
            new_task = Task(
                job_id='email_reconciliation',
                modal='email',
                message_uuid=email.message_uuid,
                message_id=email.message_id
            )
            db.session.add(new_task)
            try:
                result = await email_query(email.message_id)
                emails.last_reconciled = now
                email.status = result["Data"]["Status"]
                new_task.status=JobStatus.SUCCEEDED
                new_task.ended_at=datetime.now(timezone.utc)

                db.session.commit()
            except Exception as e:
               
                new_task.status=JobStatus.FAILED

                new_task.ended_at=datetime.now(timezone.utc)

                db.session.commit()
                current_app.logger.error(str(e))

    except Exception as e:
        db.sesssion.rollback()
        current_app.logger.error(str(e))
