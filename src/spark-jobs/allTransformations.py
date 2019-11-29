from pyspark.sql import SparkSession, Row, DataFrame
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType
from random import randint
from operator import add

stage = 'prod'

if __name__ == '__main__':
    spark = SparkSession.builder.appName('allTransformations').getOrCreate()

    input_dir = f's3n://{stage}.data.source.pdcase/b/'
    side_input_dir = f's3n://{stage}.data.warehouse.pdcase/a/students/'
    # input_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_b/'
    # side_input_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_a/'
    output_dir = f's3n://{stage}.data.warehouse.pdcase/b/'
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
    SELECT student.city, COUNT(event.at) eventos
    FROM event
    JOIN student on student.id = event.student_id
    WHERE student.city IS NOT NULL
    GROUP BY student.city
    ORDER BY eventos DESC
    ''').write.json(output_dir + '/events-by-city', mode='overwrite')

    spark.sql('''
    SELECT client_type, COUNT(at) eventos
    FROM event
    GROUP BY client_type
    ORDER BY eventos DESC
    ''').write.json(output_dir + '/events-by-client-type', mode='overwrite')

    spark.sql('''
    SELECT custom_1 universidade, COUNT(at) eventos
    FROM event
    GROUP BY universidade
    ORDER BY eventos DESC
    ''').write.json(output_dir + '/events-by-university', mode='overwrite')

    spark.sql('''
    SELECT custom_2 curso, COUNT(at) eventos
    FROM event
    GROUP BY curso
    ORDER BY eventos DESC
    ''').write.json(output_dir + '/events-by-course', mode='overwrite')

    spark.stop()
