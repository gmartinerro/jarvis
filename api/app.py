from flask import Flask, Blueprint, request
from flask_cors import CORS
from flask_restplus import Resource, Api
import json
from database import *

#########################################################
#                UTILITY FUNCTIONS                      #
#########################################################


def JsonEncoder(obj):
    if isinstance(obj, datetime.datetime):
        return obj.___str___()
    if isinstance(obj, decimal.Decimal):
        return str(obj)
    return obj


#########################################################
#                       SETUP                           #
#########################################################

app = Flask(__name__)
CORS(app)
blueprint = Blueprint('api', __name__, url_prefix='/api')
api = Api(blueprint, doc='/doc')
app.register_blueprint(blueprint)
app.config['SWAGGER_UI_JSONEDITOR'] = True
api.json_encoder = JsonEncoder

#########################################################
#                       ROUTES                          #
#########################################################
@api.route('/dayprofile/<start>/<end>', endpoint='dayprofile')
@api.doc(params={'start': 'The starting date in ISO format (%Y-%m-%d) to get profiling info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get profiling info from'})
class DayProfile(Resource):
    def get(self, start, end):

        profile = getDayProfile(start, end)
        traffic = getDayTraffic(start, end)
        averageTicket = getAverageTicket(start, end)

        response = [0] * 24
        total = 0
        for hour in profile:
            response[hour[0]] = int(hour[1])
            total += hour[1]

        return {"tickets": response, "dates": {"start": start, "end": end}, "total": str(total), "average": str(averageTicket[0]), "global": str(averageTicket[1])}


@api.route('/forecast/<start>/<end>', endpoint='forecast')
@api.doc(params={'start': 'The starting date in ISO format (%Y-%m-%d) to get profiling info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get profiling info from'})
class Forecast(Resource):
    def get(self, start, end):
        return {"forecast": start + str(token)}


@api.route('/summary/<start>/<end>', endpoint='summary')
@api.doc(params={'start': 'The staring date in ISO format (%Y-%m-%d) to get profiling info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get profiling info from'})
class Summary(Resource):
    def get(self, start, end):
        data = getOrdersData()
        return json.loads(json.dumps({"summary": data}, default=JsonEncoder))


#########################################################
#                     START CODE                        #
#########################################################
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
