# cralwer

## 목차

- [cralwer](#cralwer)
  - [목차](#목차)
  - [1. 데이터 수집](#1-데이터-수집)
    - [1-1. 펀드 코드 수집](#1-1-펀드-코드-수집)
    - [1-2. 펀드 기본 정보 수집](#1-2-펀드-기본-정보-수집)

## 1. 데이터 수집

### 1-1. 펀드 코드 수집

- 기능

  국내, 온라인 펀드 코드를 수집하여 파일, DB에 저장

- 실행

  ```
  node src/crawlers/fundCodeList.js
  ```

- 데이터

  - data/{오늘날짜}-fund-list.json

- DB
  - funds : code

### 1-2. 펀드 기본 정보 수집

- 기능
  DB에 저장된 펀드 코드를 기반으로 기본 정보 수집하여 DB에 저장

- 실행

  ```
  node src/crawlers/fundDefaultInfo.js
  ```

- DB
  - funds : data
