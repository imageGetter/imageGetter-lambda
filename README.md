# lambda
[![Build Status](https://travis-ci.org/bum752/imageGetter-lambda.svg?branch=master)](https://travis-ci.org/bum752/imageGetter-lambda)

imageGetter API with AWS Lambda

## serveless 설치
```
$ yarn global add serverless
```

## AWS 인증
AWS IAM을 이용한 인증으로 두 가지 방법 중 하나를 실행하면 됩니다.
```
# aws-cli
$ aws configure

# serverless
$ serverless config credentials --provider aws --key <Access Key ID> --secret <Secret Access Key>
```

## 테스트 및 배포

### 의존성 설치
```
$ yarn install
```

### 테스트
```
$ yarn test
```

### 배포
**(과금 주의!)**
```
$ serverless deploy
```

#### 함수 호출
```
# local
$ serverless invoke local --function imgs --data '{"pathParameters": {"encodedURI": "google.com"}}'

# aws
$ serverless invoke --function imgs --data '{"pathParameters": {"encodedURI": "google.com"}}'
```

### 삭제
과금에 주의해 배포 된 서비스를 삭제합니다.  
```
$ serverless remove
```