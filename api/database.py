import os
import pymysql

#########################################################
#                   DEFINITIONS                         #
#########################################################

RAW_BIOMETRICS_TABLE = 'raw_biometrics'
RAW_TRAFFIC_TABLE = 'raw_traffic'
RAW_ORDERS_TABLE = 'raw_orders'
RAW_CUSTOMER_ITEMS_TABLE = 'raw_customer_items'
RAW_WEATHER_TABLE = 'raw_weather'

#########################################################
#                   FUNCTIONS                           #
#########################################################


def getOrdersData():
    connection = getConnection()

    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT hour, ROUND(AVG(orders)) as avg_orders FROM (SELECT date, hour, COUNT(*) as orders FROM {RAW_ORDERS_TABLE} WHERE date >='2018-09-21' AND date <'2019-10-01' GROUP BY date, hour ORDER BY hour)k GROUP BY hour;")
        return cursor.fetchall()


def getDayProfile(start, end):
    connection = getConnection()

    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT hour, AVG(orders) as avg_orders FROM (SELECT date, hour, COUNT(*) as orders FROM {RAW_ORDERS_TABLE} WHERE date >='"+start+"' AND date <'"+end+"' GROUP BY date, hour ORDER BY hour)k GROUP BY hour;")
        return cursor.fetchall()


def getDayTraffic(start, end):
    connection = getConnection()

    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT hour, AVG(traffic) as avg_traffic FROM (SELECT date, hour, SUM(traffic) as traffic from {RAW_TRAFFIC_TABLE}  WHERE date >='+start+' AND date <'"+end+"' GROUP BY date, hour ORDER BY hour)k GROUP BY hour;")
        return cursor.fetchall()


def getAverageTicket(start, end):
    connection = getConnection()

    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT AVG(net_sales), COUNT(*) FROM {RAW_ORDERS_TABLE} WHERE date >='"+start+"' AND date <'"+end + "'")
        return cursor.fetchone()


def getConnection():
    config = dbConfig()
    print(config)
    return pymysql.connect(host=config['server'],
                           port=int(config['port']),
                           user="root",
                           passwd=config['password'],
                           db=config['database'])


def dbConfig():
    server = os.getenv('MYSQL_HOST', '127.0.0.1')
    port = os.getenv('MYSQL_PORT', '3306')
    user = os.getenv('MYSQL_USER', 'root')
    password = os.getenv('MYSQL_PASSWORD', '')
    database = os.getenv('MYSQL_DATABASE', 'aifrdb')
    return {'server': server, 'port': port, 'password': password, 'database': database}
