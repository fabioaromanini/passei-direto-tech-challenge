from pyspark.sql import SparkSession, Row, DataFrame
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType
from random import randint
from operator import add

stage = 'prod'

if __name__ == '__main__':
    spark = SparkSession.builder.appName('allTransformations').getOrCreate()

    input_dir = 's3n://' + stage + '.data.source.pdcase/b/'
    side_input_dir = 's3n://' + stage + '.data.warehouse.pdcase/a/students/'
    # input_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_b/'
    # side_input_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_a/'
    output_dir = 's3n://' + stage + '.data.warehouse.pdcase/b/'
    # output_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_b/tests/'
    file_name = 'part-*.json'
    side_file_name = '*.json'

    events = spark.read.json(input_dir + file_name) \
        .withColumnRenamed('Page Name', 'page_name') \
        .withColumnRenamed('Page Category', 'page_category') \
        .withColumnRenamed('Page Category 1', 'page_category_1') \
        .withColumnRenamed('Page Category 2', 'page_category_2') \
        .withColumnRenamed('Page Category 3', 'page_category_3') \
        .withColumnRenamed('Last Accessed Url', 'last_accessed_url') \
        .withColumnRenamed('first-accessed-page', 'first_accessed_page')

    getStudentId = udf(
        lambda columnValue: (columnValue.split('@')[0]
                             if type(columnValue) == str
                             else None),
        StringType()
    )
    getClient = udf(
        lambda columnValue: (columnValue.split('@')[1]
                             if type(columnValue) == str
                             else None),
        StringType()
    )

    events = events \
        .withColumn('student_id', getStudentId(events.studentId_clientType)) \
        .withColumn('client_type', getClient(events.studentId_clientType))

    events.createOrReplaceTempView('event')

    students = spark.read.json(side_input_dir + side_file_name)
    students.createOrReplaceTempView('student')

    spark.sql('''
    SELECT *
    FROM event
    ''').write.json(output_dir + 'events/', mode='overwrite')

    spark.sql('''
    SELECT city, COUNT(event.at) events
    FROM event
    JOIN student on student.id = event.student_id
    GROUP BY city
    ''').write.json(output_dir + 'events-by-city/', mode='overwrite')

    spark.sql('''
    SELECT state, COUNT(event.at) events
    FROM event
    JOIN student on student.id = event.student_id
    GROUP BY state
    ''').write.json(output_dir + 'events-by-state/', mode='overwrite')

    spark.sql('''
    SELECT DISTINCT marketing_source, marketing_medium, marketing_campaign, COUNT(*) sessions
    FROM event
    GROUP BY marketing_source, marketing_medium, marketing_campaign
    ''').write.json(output_dir + 'sessions-by-campaign/', mode='overwrite')

    spark.sql('''
    SELECT page_name, COUNT(*) visits
    FROM event
    GROUP BY page_name
    ''').write.json(output_dir + 'events-by-pagename/', mode='overwrite')

    spark.sql('''
    SELECT client_type, COUNT(at) events
    FROM event
    GROUP BY client_type
    ''').write.json(output_dir + 'events-by-client-type/', mode='overwrite')

    spark.sql('''
    SELECT custom_1 university, COUNT(at) events
    FROM event
    GROUP BY university
    ''').write.json(output_dir + 'events-by-university/', mode='overwrite')

    spark.sql('''
    SELECT custom_2 course, COUNT(at) events
    FROM event
    GROUP BY course
    ''').write.json(output_dir + 'events-by-course/', mode='overwrite')

    spark.stop()
