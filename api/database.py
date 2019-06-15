import os
import pymysql
import datetime

#########################################################
#                   DEFINITIONS                         #
#########################################################

RAW_BIOMETRICS_TABLE = 'raw_biometrics'
RAW_TRAFFIC_TABLE = 'raw_traffic'
RAW_ORDERS_TABLE = 'raw_orders'
RAW_CUSTOMER_ITEMS_TABLE = 'raw_customer_items'
RAW_WEATHER_TABLE = 'raw_weather'
DAILY_WIFI_TABLE = 'daily_wifi'
WIFI_RFS_TABLE = 'wifi_rfs'
RAW_RFM_TABLE = 'raw_rfm'
DAILY_RECURRENCY_TABLE = 'daily_recurrency'

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


def getDayProfileStats(start, end, weekday):

    profile = []
    outliers = []

    weekdayQuery = ' AND weekday=' + str(weekday) if weekday else ''

    with getConnection() as connection:
        cursor = connection
        for hour in range(0, 24):

            cursor.execute(
                f"SELECT COUNT(*) as orders FROM {RAW_ORDERS_TABLE} WHERE date >='{start}' AND date <'{end}' and hour={hour} {weekdayQuery} GROUP BY date ORDER BY orders asc;")

            dist = cursor.fetchall()

            length = len(dist)

            if length == 0:
                profile.append((hour, {"iqr": 0, "median": 0}))
            else:
                q25 = dist[int(length/4)][0]
                q50 = dist[int(length/2)][0]
                q75 = dist[int(3*length/4)][0]
                profile.append((hour, {"iqr": q75-q25, "median": q50}))
                outlier = q50 + 1.5 * (q75-q25)

                cursor.execute(
                    f"SELECT date, hour FROM (SELECT date, hour, COUNT(*) as orders FROM raw_orders WHERE date >='{start}' AND date <'{end}' and hour={hour} {weekdayQuery} GROUP BY date)k WHERE orders > {outlier};")
                
                for outlier in cursor:
                    outliers.append(outlier)

        return {"profile": profile, "outliers": outliers}


def getHeatmap():
    connection = getConnection()

    result = []

    with getConnection() as connection:
        cursor = connection
        cursor.execute(f"SELECT date, count(*) as orders, weekday(`date`) as wday, MONTH(`date`) as mon, WEEK(`date`) + (YEAR(`date`) - (SELECT YEAR(MIN(`date`)) FROM raw_orders)) * 52 as week  FROM raw_orders GROUP BY date;")

        start = None
        next = None
        for row in cursor:
            # if start == None:
            #     start = row[0]
            # else:
            #     if row[0] != next:
            #         print("NO", next)
            # next = start + datetime.timedelta(days=1)
        
            result.append({"date": str(row[0]),"orders":row[1],"wday":row[2],"mon":row[3],"week":row[4]})

        return result


def getDayTraffic(start, end):
    connection = getConnection()

    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT hour, AVG(traffic) as avg_traffic FROM (SELECT date, hour, SUM(traffic) as traffic from {RAW_TRAFFIC_TABLE}  WHERE date >='"+start+"' AND date <'"+end+"' GROUP BY date, hour ORDER BY hour)k GROUP BY hour;")
        return cursor.fetchall()


def getAverageTicket(start, end):
    connection = getConnection()

    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT AVG(net_sales), COUNT(*) FROM {RAW_ORDERS_TABLE} WHERE date >='"+start+"' AND date <'"+end + "'")
        return cursor.fetchone()


def getOfflineCustomersData(start, end):
    connection = getConnection()
    print(start, end)
    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT mac, COUNT(*), AVG(seconds) FROM {DAILY_WIFI_TABLE} WHERE seconds >= 300 AND seconds < 4*3600 AND date >='"+start+"' AND date <'"+end + "' GROUP BY mac")
        data = cursor.fetchall()

        return data


def getOnlineCustomersData(start, end):
    connection = getConnection()
    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT customer_id, COUNT(*),AVG(order_total)  FROM (SELECT DATE(order_date), customer_id,AVG(order_total) as order_total FROM {RAW_CUSTOMER_ITEMS_TABLE} WHERE customer_id IS NOT NULL AND order_date >='"+start+"' AND order_date <'" + end + "' GROUP BY customer_id,DATE(order_date)) k GROUP BY customer_id")
        data = cursor.fetchall()
        return data


def getRecurrencyData(start, end):
    connection = getConnection()
    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT * FROM {DAILY_RECURRENCY_TABLE}")
        data = cursor.fetchall()

        return data


def getRFMData():
    connection = getConnection()
    with getConnection() as connection:
        cursor = connection
        cursor.execute(
            f"SELECT * FROM {RAW_RFM_TABLE} ORDER BY monetary desc")
        data = cursor.fetchall()

        return data


def getConnection():
    config = dbConfig()
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
