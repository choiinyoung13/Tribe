# 🌱거래와 소통이 어우러진 식물 마켓 - 트리비

 식물 판매 및 구매가능과 원하는 식물에 대한 정보을 유저들끼리 공유할 수 있는 커뮤니티 기능을 제공하는 플랫폼

 <br>

## 🧩기획 배경

- 최근 많은 사람들이 정신적인 안정과 힐링을 찾으려는 경향이 증가하고 있으며, 한국의 식물 거래 시장이 지속적으로 성장하고 있다는 점을 주목 했습니다.
- 그러나 식물을 구매하고, 관리하며, 교환할 수 있는 효율적인 플랫폼은 여전히 부족한 상황이기에 무신사처럼 쉽게 판매 및 구매가 가능하며 커뮤니티 기능까지 제공하는 식물 거래 플랫폼을 기획하게 되었습니다.

 <br>

## 🎈해결 컨셉
- 사용자들이 식물을 쉽게 구매하고 판매할 수 있는 직관적인 플랫폼을 제공합니다.
- 사용자 간의 소통과 정보 공유를 활성화하고, 식물 관리 팁이나 경험을 공유할 수 있는 커뮤니티 공간을 제공합니다.

 <br>

## 🗝기대 효과
- 커뮤니티 기능을 통해 식물 애호가들이 서로 정보를 공유하고 교류할 수 있어 식물 관리에 대한 노하우가 축적되고 확산됩니다. 이를 통해 사용자들은 더 많은 지식을 얻고, 다양한 식물에 도전하거나 문제를 해결하는 데 도움을 받을 수 있습니다.

 <br>

## 🛠기술 스펙
- **회원가입 / 로그인**
    - **회원가입**: 아이디, 이메일과 비밀번호를 사용하여 계정을 생성하며, 이메일 인증을 통해 계정 활성화 할 수 있습니다.
    - **로그인**: 아이디, 비밀번호로 로그인 가능하며, 카카오, 구글을 통한 소셜 로그인이 가능합니다.
    - **회원 정보 관리**: 사용자 정보 조회 및 수정 가능. 회원 탈퇴 기능, 비밀번호 수정기능, 이메일 수정 기능 제공합니다.
      
<br>
      
- **거래**
    - **식물구매**: 구매자는 다양한 카테고리 또는 키워드로 식물을 검색하고, 필터링된 결과를 통해 원하는 식물을 쉽게 찾아 구매할 수 있습니다.
<br>

- **커뮤니티**
    - **게시글 작성**: 사용자들은 자신이 키우는 식물, 관리 방법, 식물 관련 질문 등을 공유하는 게시글을 작성할 수 있습니다. 글 작성 시 사진 첨부 및 카테고리 설정이 가능하며, 다른 사용자들이 게시글에 댓글을 달아 소통할 수 있습니다.
    - **커뮤니티 카테고리**: 다양한 주제로 게시글을 분류할 수 있는 카테고리가 제공되며, 이를 통해 사용자는 자신이 관심 있는 주제를 쉽게 찾아보고 참여할 수 있습니다. 예시: 질문, 잡담, 질문, 나눔, 이벤트.
    - **좋아요 및 댓글**: 게시글에 대한 공감 표현으로 ‘좋아요’ 기능을 제공하며, 사용자들이 적극적으로 참여하고 의견을 나눌 수 있도록 댓글 기능을 지원합니다.
    - **커뮤니티 가이드라인**: 커뮤니티 내에서의 에티켓과 규칙을 제시하여, 사용자들이 서로 존중하는 분위기에서 건강하게 정보를 교류할 수 있도록 합니다.
<br>

- **유저 추천 기능**
    - **추천 유저 피드**: 커뮤니티 페이지에 주기적으로 업데이트되는 '유저 추천' 목록을 제공하며, 새로운 사용자들이 쉽게 커뮤니티 내에서 다양한 유저들의 정보를 얻을 수 있습니다. (현재는 랜덤으로 추천, 추후에 알고리즘을 이용해서 유사한 관심사를 가진 사용자를 추천할 계획)
<br>

- **주간 인기 키워드 기능**
    - **키워드 분석**: 매주 커뮤니티에서 자주 언급되는 키워드들을 수집 및 분석하여, 사용자들이 현재 화제인 식물이나 관련 주제가 무엇인지 알 수 있도록 도와줍니다.
 <br>

## 아키텍처
![아키텍처2](https://github.com/user-attachments/assets/d8428d7c-2e94-46d3-a6d1-73075574c994)

 <br>

## 사용 기술
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
<img src="https://img.shields.io/badge/typescript-239DAD?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/recoli-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
<img src="https://img.shields.io/badge/tanskquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
<img src="https://img.shields.io/badge/styledcomponents-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
<img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white">


