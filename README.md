# 🎬 Project: Starbox

- 영화 예매 서비스를 제공하는 ['메가박스](https://www.megabox.co.kr/)' 사이트에 사용된 API 들을 참고하여 필요 기능들을 개발한 클론 프로젝트입니다. 개발은 초기 세팅부터 전부 직접 구현하였으며 사용된 데이터 또한 모두 직접 입력하였습니다.
  
- 사이트 선정 이유 - 기본적인 웹서비스의 CRUD 기능 이외에도 본인인증, 좌석예약, 리뷰, 좋아요 등 새로운 기능들을 접해볼 수 있고, 적지 않은 데이터들을 다양한 방법으로 입력해보고 테이블들의 연결 구조를 배워볼 수 있다는 점에서 선정하게 되었습니다.
  
- 서비스 시연영상
  
  - [전체서비스 ](https://youtu.be/K6d3YfHN9Jk)(약 7분)
    
  - [빠른예매](https://youtu.be/V87Euvf2jiY) (약 3분)
    
  - [상영시간표](https://youtu.be/c99YMNSKJbw) (약 1분)
    
<div align="center">
<img width="1000" alt="스크린샷 2022-10-04 오후 1 38 35" src="https://user-images.githubusercontent.com/70873668/197322159-cf41db23-8d35-4f1d-8f72-c357423500dd.png">
</div>

## 🎬 1. 개발기간 및 인원

- **개발 기간** : 22-09-19 ~ 22-09-30 (12 DAYS)
  
- **Front End** : 김정연, 박유빈, 양미옥, 이동호 - 4명
  
- **Back End** : 김민우, 오인환 - 2명
  
- [Front-End Repository 바로가기](https://github.com/wecode-bootcamp-korea/justcode-6-2nd-team2-front)
  
- [Back-End Repository 바로가기](https://github.com/wecode-bootcamp-korea/justcode-6-2nd-team2-back)
  

## 🎬 2. 데이터 모델링

▶️ [dbdiogram 링크](https://dbdiagram.io/d/6328594d0911f91ba5e24b09)
</br>
![Starbox_dbdiagram](https://user-images.githubusercontent.com/70873668/197322397-38c2fab9-b54a-4e07-ba03-fd53809de941.png)
</br>
## 🎬 3. 적용 기술 및 구현 기능

### 3-1. 적용 기술

- Front-end : React.js(개발환경은 CRU), sass, styled-componets, fetch, axios, ContextAPI, webpack(컴파일러는 babel)
- Back-end : Node.js, Express, TypeORM, MySQL, JWT, bcrypt, SENS API
- Common : RESTful API, PostMan, LiveServer, nodemon, Google Spreadsheet
- Community Tools : Slack, Zoom, Notion, Zepp, Trello
- Version Control Tool : Git(flow는 github flow방식을 따름)
![trello](https://user-images.githubusercontent.com/70873668/197322415-f2f7dd74-74da-470b-b54a-e6078d912e97.PNG)
</br>

### 3-2. 구현 기능

> **프론트엔드**

- 이동호
  
  - [예매페이지] 빠른예매 화면 UI 및 레이아웃
  - [예매페이지] 날짜, 시간별 슬라이드 추가
  - [예매페이지] 더보기 달력 추가 및 에러 헨들링 모달 기능
  - [예매페이지] 좌석선택 화면 전체 UI
  - [예매페이지] 인원별 좌선 선택 기능
  - [예매페이지] 결제화면 전체 UI
  - [예매페이지] 결제API 연동
  - [상영시간표] 전체 UI 및 레이아웃
  - [상영시간표] 더보기 달력 추가
  - [상영시간표] 날짜별 슬라이드
  - [상영시간표] 네비게이션 영화, 극장별 Tab
- 김정연
  
  - [상세페이지] 전체 레이아웃
  - [상세페이지] 누적관객수 tooltip
  - [상세페이지] 기대평 등록 삭제 레이아웃
  - [상세페이지] 무비포스트 레이아웃
  - [상세페이지] 예고편 레이아웃
  - [상세페이지] 스틸컷 레이아웃
  - [상세페이지] 기대평 map
  - [상세페이지] 예매버튼 링크
  - [상세페이지] 좋아요 api
- 박유빈
  
  - [영화리스트] 전체 레이아웃
  - [영화리스트] 영화 카테고리 페이지 이동 기능
  - [영화리스트] 박스오피스 레이아웃
  - [영화리스트] 영화 리스트 카운트 기능
  - [영화리스트] 영화 리스트 map
  - [영화리스트] 영화 더보기 페이지네이션 기능
  - [영화리스트] 영화 포스트 이벤트
  - [영화리스트] 영화 검색 기능
  - [영화리스트] 영화 필터 기능
- 양미옥
  
  - [헤더] 전체 레이아웃
  - [헤더] use의 이동경로에 따른 ui 구현
  - [헤더] 서브메뉴 탭기능
  - [로그인] 전체 레이아웃
  - [로그인] 휴대폰 인증 기능
  - [로그인] 약관동의 레이아웃
  - [로그인] 약관동의 필터 기능
  - [마이페이지] 네비게이션 레이아웃

> **백엔드**

- 김민우
  
  - ERD 모델링
  - 데이터 입력 (영화진흥위원회 통합전산망 제공 DB 사용)
  - [영화] 전체 리스트 조회 API
  - [영화] 검색 기능 구현
  - [영화] 상영작/개봉예정작/개봉일순/이름순/국내/해외 필터 및 정렬 기능
  - [영화] 페이지네이션 기능 (더보기)
  - [영화] 상세페이지 조회 API
  - [리뷰] 리뷰 조회 API - 현재 기준으로 작성일자 소요 시간(분단위) 조회 기능 (몇분 전 작성)
  - [리뷰] 리뷰 조회 API - 작성된 리뷰의 평점 평균 / 총 갯수 조회 기능 구현
  - [예매] 상영스케쥴 조회 API - 상영일자/영화/지역/영화관별 상영스케쥴 - 다중 필터 적용
  - [예매] 좌석선택 API - 영화관별 등록된 좌석 데이터와 각 상영스케쥴 연동 기능
  - [예매] 좌석선택 API - 예약된 좌석 정보 전달 기능
  - [예매] 티켓생성 API - 선택한 좌석/인원/유형으로 좌석 예약기능
  - [좋아요] 유저-영화별 좋아요 추가/삭제 API
- 오인환
  
  - ERD 모델링
  - 데이터 입력 (영화진흥위원회 통합전산망 제공 DB 사용)
  - [유저] 회원가입 / 로그인 API
  - [유저] 아이디 찾기 기능
  - [유저] 비밀번호 찾기 및 임시비밀번호 발급 API
  - [유저] 토큰 인증/인가 API
  - [유저] 휴대폰 SMS 본인 인증 API (네이버 SENS API 사용)
  - [유저] 마이페이지 API
  - [리뷰] 리뷰 생성/삭제 API

## 🎬 4. API Docs

▶️[ POSTMAN API Docs 링크](https://documenter.getpostman.com/view/22703204/2s7ZE4NQnp)

<img width="1000" alt="postman" src="https://user-images.githubusercontent.com/70873668/197322498-e2088ff1-e29c-404a-9f15-948b030e1057.png">


## 🔷 Reference

- 이 프로젝트는 [메가박스](https://www.megabox.co.kr/) 사이트를 참조하여 학습목적으로 만들었습니다.
- 실무수준의 프로젝트이지만 학습용으로 만들었기 때문에 이 코드를 활용하여 이득을 취하거나 무단 배포할 경우 법적으로 문제될 수 있습니다.
