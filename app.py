# coding=utf-8
import flask
from flask.ext.cors import CORS
import pymongo


app = flask.Flask('takalam')
cors = CORS(app)

mongo_client = pymongo.MongoClient()
db = mongo_client['takalam']

# setup indexes and stuff
questions_col = db['questions']
questions_col.create_index('qid', unique=True)
answers_col = db['answers']
answers_col.create_index('qid', unique=True)
