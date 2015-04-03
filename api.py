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


DEMO_GROUPS = {
    1: {
        'gender': 1,
        'age': 1,
    },
    2: {
        'gender': 1,
        'age': 2,
    },
    3: {
        'gender': 2,
        'age': 1,
    },
    4: {
        'gender': 2,
        'age': 2,
    },
}


@app.route('/')
def home():
    return "Hello Takalam!"


@app.route('/api/question/', methods=['GET', 'POST'])
def questions_view():
    try:
        qid = int(flask.request.args['qid'])
        question = get_question(qid)
    except (TypeError, ValueError) as e:
        return flask.abort(400)

    if flask.request.method == 'GET':
        qdict = {
            'question': question['question'],
            'sub_questions': question.get('sub_questions', list())
        }
        return flask.jsonify(qdict)
    else:
        demoid = int(flask.request.args['demoid'])
        user_demographic_info = DEMO_GROUPS[demoid]

        main_question_response = flask.request.form['response']
        try:
            main_question_response = bool(int(main_question_response))
        except (TypeError, ValueError) as e:
            return ('You must answer all questions', 400, {})

        user_response_dict = {
            'qid': qid,
            'uid': str(uuid.uuid4()),
            'main_response': main_question_response,

            'user_demographic': user_demographic_info
        }

        if question.get('sub_questions'):
            sub_question_responses = flask.request.form['sub_question_responses']
            sub_question_responses_list = map(lambda x: bool(int(x)), sub_question_responses.split(','))
            if len(sub_question_responses_list) != len(question['sub_questions']):
                return ('You must answer all questions', 400, {})

            user_response_dict['sub_responses'] = sub_question_responses_list

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

        user_responses = responses_col.find({'qid': qid, 'comment': {'$exists': True}})
        user_responses_list = list()
        for ur in user_responses:
            user_responses_list.append({
                'response': ur['main_response'],
                'comment': ur['comment'],
                'name': ur['name']
            })

        response_dict['comments'] = user_responses_list

        return flask.jsonify(response_dict)


@app.route('/api/comment/', methods=['POST'])
def comments_view():
    qid = flask.request.args['qid']
    question = get_question(qid)
    qid = int(qid)

    uid = flask.request.form['uid']
    user_name = flask.request.form.get('name', 'Anonymous')
    comment = flask.request.form['comment']

    response_query_dict = {
        'qid': qid,
        'uid': uid,
        'comment': {
            '$exists': False
        }
    }
    response_update_dict = {
        '$set': {
            'comment': comment,
            'name': user_name
        }
    }
    responses_col.update(response_query_dict, response_update_dict)

    return ''


def get_question(qid):
    try:
        qid = int(qid)
    except (TypeError, ValueError):
        flask.abort(404)

    return questions_col.find_one({'qid': qid}) or flask.abort(404)

