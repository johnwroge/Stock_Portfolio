
from celery import Celery
from email_utils import send_email
from flask import current_app
from jinja2 import Template
import os
user_email = os.getenv('USER_EMAIL')

celery = Celery(__name__)

@celery.task
def send_weekly_report():
    subject = "Weekly Stock Report"
    recipient = user_email
    
    template_path = os.path.join(os.path.dirname(__file__), 'templates', 'weekly_report_template.html')
    with open(template_path, 'r') as file:
        template_content = file.read()
    
    template = Template(template_content)
    html_body = template.render()  #
    
    send_email(recipient, subject, "Your weekly stock report is attached below.", html_body)
