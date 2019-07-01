from flask import Flask, Blueprint, request
from flask_cors import CORS
from flask_restplus import Resource, Api
import json
from database import *
import datetime
import decimal

#########################################################
#                UTILITY FUNCTIONS                      #
#########################################################


def JsonEncoder(obj):
    if isinstance(obj, datetime.datetime):
        return obj.__str__()
    if isinstance(obj, datetime.date):
        return obj.strftime("%Y-%m-%d")
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
        _traffic = getDayTraffic(start, end)
        averageTicket = getAverageTicket(start, end)

        response = [0] * 24
        traffic = [0] * 24
        total = 0
        for hour in profile:
            response[hour[0]] = int(hour[1])
            total += hour[1]

        relTraffic = [0] * 24
        for hour in _traffic:

            traffic[hour[0]] = float(_traffic[hour[0]][1])

            if hour[0] < 7:
                relTraffic[hour[0]] = 0
            else:
                # relTraffic[hour[0]] = (response[hour[0]]*100 /
                #                        int(hour[1])) if int(hour[1]) > 0 else 10
                relTraffic[hour[0]] = (int(hour[1]) /
                                       response[hour[0]]) if response[hour[0]] > 0 else 100

        return json.loads(json.dumps({"tickets": response, "dates": {"start": start, "end": end}, "total": str(total), "average": str(averageTicket[0]), "global": str(averageTicket[1]), "traffic": relTraffic}, default=JsonEncoder))


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


@api.route('/customers/offline/<start>/<end>', endpoint='offline')
@api.doc(params={'start': 'The staring date in ISO format (%Y-%m-%d) to get offline customers info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get offline customers info from'})
class Summary(Resource):
    def get(self, start, end):
        data = getOfflineCustomersData(start, end)
        return json.loads(json.dumps({"offline": data}, default=JsonEncoder))


@api.route('/customers/online/<start>/<end>', endpoint='online')
@api.doc(params={'start': 'The staring date in ISO format (%Y-%m-%d) to get offline customers info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get offline customers info from'})
class Summary(Resource):
    def get(self, start, end):
        data = getOnlineCustomersData(start, end)
        return json.loads(json.dumps({"online": data}, default=JsonEncoder))


@api.route('/customers/recurrency/<start>/<end>', endpoint='recurrency')
@api.doc(params={'start': 'The staring date in ISO format (%Y-%m-%d) to get offline customers info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get offline customers info from'})
class Summary(Resource):
    def get(self, start, end):
        data = getRecurrencyData(start, end)
        return json.loads(json.dumps(data, default=JsonEncoder))


@api.route('/customers/rfm', endpoint='rfm')
class Summary(Resource):
    def get(self):
        data = getRFMData()
        return json.loads(json.dumps(data, default=JsonEncoder))


@api.route('/daystats/<start>/<end>', defaults={'weekday': None})
@api.route('/daystats/<start>/<end>/<weekday>', endpoint='daystats')
@api.doc(params={'start': 'The starting date in ISO format (%Y-%m-%d) to get profiling info from', 'end': 'The ending date in ISO format (%Y-%m-%d) to get profiling info from'})
class DayProfileStats(Resource):
    def get(self, start, end, weekday):
        heatmap = getHeatmap()
        stats = getDayProfileStats(start, end, weekday)
        return json.loads(json.dumps({'heatmap': heatmap, 'stats': stats}, default=JsonEncoder))


#########################################################
#                     START CODE                        #
#########################################################
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
