# from app.models.campaign import Campaign
# from app.models.user import User
# from app.services.email_handler import EmailHandler
# from flask import current_app
# from app.utils.constants import EmailType


# # function chould call a class


# async def campaign_emails():
#     try:
#         donors = User.query.filter_by(User.email != None, User.subscibe == True).all()

#         active_campaign = Campaign.query.filter_by(is_active=True).first()
#         if not active_campaign:
#             current_app.logger.info(
#                 "Email Scheduler: No active campaigns to send u emails to."
#             )
#             return
#         for donor in donors:
#             try:
#                 EmailDonor(
#                     donor.id,
#                     donor.email,
#                     active_campaign.id,
#                     EmailType.CAMPAIGN_UPDATE,
#                 )
#                 current_app.logger.info(
#                     f"Email Scheduler: Success '{EmailType.CAMPAIGN_UPDATE}' for email: '{donor.email}'"
#                 )
#             except Exception as e:
#                 current_app.logger.error("Email Scheduler: " + str(e))
#         current_app.logger.info(
#             f"Email Scheduler: Success '{EmailType.CAMPAIGN_UPDATE}' sent for campaign: '{active_campaign.id}"
#         )
#     except Exception as e:
#         current_app.logger.error("Email Scheduler: " + str(e))
