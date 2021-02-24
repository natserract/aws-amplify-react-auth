import awsconfig from '../aws-exports'

export const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
export const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
export const S3_BUCKET_REGION = awsconfig.aws_user_files_s3_bucket_region
export const S3_BUCKET_NAME = awsconfig.aws_user_files_s3_bucket
export const AUTH_TYPE = "AMAZON_COGNITO_USER_POOLS" || awsconfig.aws_appsync_authenticationType