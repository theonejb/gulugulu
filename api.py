# coding=utf-8
import uuid

import flask
from flask.views import MethodView


from app import app
from app import (
    questions_col,
    answers_col,
    responses_col
)


@app.route('/')
def home():
    return "Hello Takalam!"


class QuestionsAPI(MethodView):
    DEMO_GROUPS = {
        1: {
            'age': 1,
            'gender': 1,
            'edu': 1
        },
        2: {
            'age': 1,
            'gender': 1,
            'edu': 2
        },
        3: {
            'age': 1,
            'gender': 2,
            'edu': 1
        },
        4: {
            'age': 1,
            'gender': 2,
            'edu': 2
        },
        5: {
            'age': 2,
            'gender': 1,
            'edu': 1
        },
        6: {
            'age': 2,
            'gender': 2,
            'edu': 1
        },
        7: {
            'age': 2,
            'gender': 1,
            'edu': 2
        },
        8: {
            'age': 2,
            'gender': 2,
            'edu': 2
        },
    }

    def get(self):
        qid = flask.request.args['qid']

        question = self.get_question(qid)
        qdict = {
            'question': question['question'],
            'sub_questions': question['sub_questions']
        }
        return flask.jsonify(qdict)

    def post(self):
        qid = flask.request.args['qid']
        question = self.get_question(qid)

        demoid = int(flask.request.args['demoid'])
        user_demographic_info = self.DEMO_GROUPS[demoid]

        main_question_response = flask.request.args['response']
        try:
            main_question_response = bool(int(main_question_response))
        except (TypeError, ValueError) as e:
            return ('You must answer all questions', 400, {})

        sub_question_responses = flask.request.args['sub_question_responses']
        sub_question_responses_list = map(lambda x: bool(int(x)), sub_question_responses.split(','))
        if len(sub_question_responses_list) != len(question['sub_questions']):
            return ('You must answer all questions', 400, {})

        user_response_dict = {
            'qid': qid,
            'uid': str(uuid.uuid4()),
            'main_response': main_question_response,
            'sub_responses': sub_question_responses_list,

            'user_demographic': user_demographic_info
        }
        responses_col.insert(user_response_dict)

        query_doc = {
            'qid': qid
        }
        query_doc.update(user_demographic_info)

        if main_question_response:
            field_name = 'num_agrees'
        else:
            field_name = 'num_disagrees'
        update_doc = {
            '$inc': {
                field_name: 1
            }
        }

        answers_col.update(query_doc, update_doc, upsert=True)

        updated_answer = answers_col.find_one(query_doc)
        response_dict = {
            'qid': qid,
            'num_agrees': updated_answer.get('num_agrees', 0),
            'num_disagrees': updated_answer.get('num_disagrees', 0),

            'uid': user_response_dict['uid']
        }

        return flask.jsonify(response_dict)

    def get_question(self, qid):
        qid = int(qid)

        return questions_col.find_one({'qid': qid}) or flask.abort(404)


questions_view = QuestionsAPI.as_view('questions_api')
app.add_url_rule('/api/question/', view_func=questions_view, methods=['GET', 'POST'])
