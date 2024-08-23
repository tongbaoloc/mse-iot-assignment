import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('incubator_montoring')
    
    # Use scan to get all items from the table
    response = table.scan()
    
    # Return the response data
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items'])
    }
