from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

def make_celery(app):
    celery = Celery(app.import_name, backend=app.config['CELERY_RESULT_BACKEND'], broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    return celery

app = Flask(__name__)
app.config.update(
    CELERY_BROKER_URL=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    CELERY_RESULT_BACKEND=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

celery = make_celery(app)


celery.conf.beat_schedule = {
    'send-weekly-report': {
        'task': 'tasks.send_weekly_report',
        'schedule': crontab(day_of_week='sun', hour=0, minute=0), 
    },
}

celery.conf.timezone = 'UTC'  
