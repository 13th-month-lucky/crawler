# cralwer

## 목차

- [cralwer](#cralwer)
  - [목차](#목차)
  - [1. 데이터 수집](#1-데이터-수집)
    - [1-1. 펀드 코드 수집](#1-1-펀드-코드-수집)
    - [1-2. 펀드 기본 정보 수집](#1-2-펀드-기본-정보-수집)
    - [1-3. 펀드 포트폴리오 수집](#1-3-펀드-포트폴리오-수집)
    - [1-4. 펀드 수익률 수집](#1-4-펀드-수익률-수집)
    - [1-4. 펀드 기준가 수집](#1-4-펀드-기준가-수집)

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

### 1-3. 펀드 포트폴리오 수집

- 기능
  DB에 저장된 펀드 코드를 기반으로 포트폴리오를 수집하여 DB에 저장

- 실행

  ```
  node src/crawlers/fundPortfolio.js
  ```

- DB
  - funds : portfolio

### 1-4. 펀드 수익률 수집

- 기능
  DB에 저장된 펀드 코드를 기반으로 수익률을 수집하여 DB에 저장

- 실행

  ```
  node src/crawlers/fundProfit.js
  ```

- DB
  - funds : profit

### 1-4. 펀드 기준가 수집

- 기능
  DB에 저장된 펀드 코드를 기반으로 기준가를 수집하여 DB에 저장

- 실행

  ```
  node src/crawlers/fundBasePrice.js
  ```

- DB
  - funds : basePrice
